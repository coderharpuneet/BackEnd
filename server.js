const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === "GET") {
        if (url === "/") {
            // Root route
            fs.readFile("User.json", "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        } else if (url === "/allstudent") {
            fs.readFile("allstudent.html", "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else if (url === "/register") {
            fs.readFile("register.html", "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else {
            // Handle unknown routes
            res.writeHead(404);
            res.end("Not Found");
        }
    } else if (method === "POST") {
        // Handle POST requests
        if (url === "/register") {
            let body = "";

            // Collect POST data
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                const userData = qs.parse(body);

                let users = [];
                try {
                    const fileData = fs.readFileSync("User.json", "utf8");
                    users = JSON.parse(fileData);
                } catch (error) {
                    console.error("Error reading User.json:", error);
                }

                users.push(userData);

                fs.writeFile("User.json", JSON.stringify(users, null, 2), (err) => {
                    if (err) {
                        console.error("Error writing to User.json:", err);
                        res.writeHead(500);
                        res.end("Server Error");
                        return;
                    }
                    console.log("User data added successfully.");
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end("Registration successful!");
                });
            });
        } else {
            res.writeHead(404);
            res.end("Not Found in POST request");
        }
    } else {
        res.writeHead(405);
        res.end("Method Not Allowed");
    }
});

server.listen(9000, () => {
    console.log("Server listening on port 9000");
});
