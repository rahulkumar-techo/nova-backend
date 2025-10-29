# nova-backend
Notes app backend (REST api)

<!--  -->
⚙️ PM2 – 

PM2 (Process Manager 2) is mainly used in production to keep your Node.js server alive, manage logs, and automatically restart apps when they crash or reboot.

## 🧰 Installation

Install globally (recommended):

```cmd
npm install -g autocannon
```

## Basic CLI Usage

Example: testing your doctor clinic API (e.g. /api/doctors):

```cmd 
autocannon -c 50 -d 20 -p 10 http://localhost:5000/api/doctors
```
| Flag    | Description                                            |
| ------- | ------------------------------------------------------ |
| `-c 50` | 50 concurrent connections (simulates 50 users at once) |
| `-d 20` | run the test for 20 seconds                            |
| `-p 10` | make 10 requests per connection (pipelining)           |
