const http = require("http")

const PaymentInformationController = require("./Controllers/PaymentInformationController");

const server = http.createServer((req, res) => {
    let paymentInformationController = new PaymentInformationController();

    if (req.method === 'POST' && req.url === "/api/validate-card"){

        paymentInformationController.handle(req, res);
        return;
    }
    if (req.method === 'POST' && req.url === "/api/get-hash"){

        paymentInformationController.getHash(req, res);
        return;
    }
    paymentInformationController.handleResponse(res, 404, {
      status: "Not Found",
      message: "The requested resource was not found on this server"
    });
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`server running on port ${PORT}`))