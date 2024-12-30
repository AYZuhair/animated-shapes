CC = gcc
CFLAGS = -Wall
LDFLAGS = -lws2_32

TARGET = server.exe
SRCS = main.c

$(TARGET): $(SRCS)
	$(CC) $(CFLAGS) $(SRCS) -o $(TARGET) $(LDFLAGS)

clean:
	del $(TARGET)