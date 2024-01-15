#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <WiFiManager.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TimeLib.h>


unsigned long previousMillis1 = 0;
unsigned long previousMillis2 = 0;  //khai báo cờ để chạy delay trong loop

int temperature = 0;
int humidity = 0;

const char* serverAddress = "192.168.1.5";
const int serverPort = 3000;
const char* serverUrl = "http://192.168.1.5:3000/api/control";  //khai báo https sẽ get và post data

WiFiManager wifiManager;  //khởi tạo biến wifimanager

const long utcOffsetInSeconds = 7 * 3600;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);  //settings hàm lấy biến thời gian


void setup() {
  Serial.begin(9600);                        //khởi tạo serial
  wifiManager.autoConnect("AutoConnectAP");  //khởi tạo wifi AutoConnectAP để kết nối vào wifi
  timeClient.begin();                        //khởi tạo hàm lấy thời gian
}


void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis1 >= 6000) {  //hàm gửi dữ liệu, chạy lại mỗi 1p
    previousMillis1 = currentMillis;
    char formattedTime[20];
    formatTime(timeClient.getEpochTime(), formattedTime);
    timeClient.update();

    temperature=random(10,80);
    humidity=random(0,2);
    Serial.println(temperature);
    Serial.println(humidity);
    Serial.println(formattedTime); 
    sendDataToServer(temperature, humidity, timeClient.getEpochTime());
  }
  // if (currentMillis - previousMillis2 >= 100) {  // liên tục get dữ liệu mỗi 100ms để đảm bảo thời gian đk delay max 100ms
  //   previousMillis2 = currentMillis;
  //   getDataFromServer();
  // }
}

void formatTime(unsigned long epochTime, char* buffer) {  //hàm format lại biến thời gian về dạng hh:mm,dd/mm/yyyy
  sprintf(buffer, "%02d:%02d %02d/%02d/%04d", hour(epochTime), minute(epochTime), day(epochTime), month(epochTime), year(epochTime));
}

void sendDataToServer(float temperature, float humidity, unsigned long timestamp) {  //hàm gửi dữ liệu qua http với 2 biến giả định temp và humi
  char formattedTime[20];
  formatTime(timestamp, formattedTime);

  String jsonData = "{\"temperature\":" + String(temperature) + ",\"humidity\":" + String(humidity) + ",\"timestamp\":\"" + String(formattedTime) + "\"}";

  WiFiClient client;

  if (client.connect(serverAddress, serverPort)) {
    client.println("POST /api/data HTTP/1.1");
    client.println("Host: " + String(serverAddress));
    client.println("Content-Type: application/json");
    client.println("Content-Length: " + String(jsonData.length()));
    client.println();
    client.println(jsonData);
    client.println();
    Serial.println("Data sent to server");
  } else {
    Serial.println("Failed to connect to server");
  }
  client.stop();
}

// void getDataFromServer() {  //hàm nhận và xử lý dữ liệu từ server
//   HTTPClient http;
//   WiFiClient client;
//   http.begin(client, serverUrl);

//   int httpResponseCode = http.GET();

//   if (httpResponseCode == HTTP_CODE_OK) {
//     String response = http.getString();
//     DynamicJsonDocument jsonDoc(1024);
//     DeserializationError error = deserializeJson(jsonDoc, response);
//     int data_rcv = jsonDoc[0]["value"];
//     Serial.println(response);
//     Serial.println("Server response: ");
//     Serial.println(data_rcv);
//     // controlLed(data_rcv);
//   } else {
//     Serial.printf("HTTP Request failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
//   }
//   http.end();
// }