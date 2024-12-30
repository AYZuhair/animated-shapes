#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#ifdef _WIN32
#include <winsock2.h>
#pragma comment(lib, "ws2_32.lib")
#endif

#define PORT 8080
#define BUFFER_SIZE 1024

void serve_file(SOCKET client_socket, const char* file_path, const char* content_type) {
    char full_path[512];
    // Get the current working directory
    char cwd[256];
    getcwd(cwd, sizeof(cwd));
    
    // Construct the full path
    snprintf(full_path, sizeof(full_path), "%s\\%s", cwd, file_path);
    
    printf("Attempting to serve: %s\n", full_path);  // Debug print
    
    FILE* file = fopen(full_path, "rb");
    if (file == NULL) {
        printf("Failed to open file: %s\n", full_path);  // Debug print
        const char* response = "HTTP/1.1 404 Not Found\r\nContent-Length: 13\r\nContent-Type: text/plain\r\n\r\nFile not found";
        send(client_socket, response, strlen(response), 0);
        return;
    }

    // Prepare and send headers
    char buffer[BUFFER_SIZE];
    sprintf(buffer, "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nConnection: close\r\n\r\n", content_type);
    send(client_socket, buffer, strlen(buffer), 0);

    // Send file content
    size_t bytes_read;
    while ((bytes_read = fread(buffer, 1, BUFFER_SIZE, file)) > 0) {
        send(client_socket, buffer, bytes_read, 0);
    }

    fclose(file);
}

int main() {
    #ifdef _WIN32
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        printf("WSAStartup failed\n");
        return 1;
    }
    #endif

    // Print current working directory
    char cwd[256];
    getcwd(cwd, sizeof(cwd));
    printf("Current working directory: %s\n", cwd);

    SOCKET server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket == INVALID_SOCKET) {
        printf("Socket creation failed\n");
        return 1;
    }

    // Allow socket reuse
    int opt = 1;
    if (setsockopt(server_socket, SOL_SOCKET, SO_REUSEADDR, (const char*)&opt, sizeof(opt)) == SOCKET_ERROR) {
        printf("Setsockopt failed\n");
        return 1;
    }

    struct sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    if (bind(server_socket, (struct sockaddr*)&server_addr, sizeof(server_addr)) == SOCKET_ERROR) {
        printf("Bind failed\n");
        closesocket(server_socket);
        return 1;
    }

    if (listen(server_socket, SOMAXCONN) == SOCKET_ERROR) {
        printf("Listen failed\n");
        closesocket(server_socket);
        return 1;
    }

    printf("Server running on http://localhost:%d\n", PORT);

    while (1) {
        SOCKET client_socket = accept(server_socket, NULL, NULL);
        if (client_socket == INVALID_SOCKET) {
            printf("Accept failed\n");
            continue;
        }

        char buffer[BUFFER_SIZE];
        int bytes_received = recv(client_socket, buffer, BUFFER_SIZE - 1, 0);
        if (bytes_received > 0) {
            buffer[bytes_received] = '\0';
            
            char method[10], path[255], protocol[20];
            sscanf(buffer, "%s %s %s", method, path, protocol);
            
            printf("Received request: %s %s\n", method, path);  // Debug print

            if (strcmp(path, "/") == 0) {
                serve_file(client_socket, "public/index.html", "text/html");
            }
            else if (strstr(path, ".css")) {
                char file_path[512];
                snprintf(file_path, sizeof(file_path), "public/%s", path);
                serve_file(client_socket, file_path, "text/css");
            }
            else if (strstr(path, ".js")) {
                char file_path[512];
                snprintf(file_path, sizeof(file_path), "public/%s", path);
                serve_file(client_socket, file_path, "text/javascript");
            }
            else {
                serve_file(client_socket, "public/index.html", "text/html");
            }
        }

        closesocket(client_socket);
    }

    closesocket(server_socket);
    #ifdef _WIN32
    WSACleanup();
    #endif

    return 0;
}