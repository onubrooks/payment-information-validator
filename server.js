const http = require("http")

const PaymentInformationController = require("./Controllers/PaymentInformationController");

const server = http.createServer((req, res) => {
    let paymentInformationController = new PaymentInformationController();

    if (req.method === 'POST' && req.url === "/api/validate-card"){

        paymentInformationController.handle(req, res);
    }else {
        paymentInformationController.handleResponse(res, 404, "route not found");
    }
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`server running on port ${PORT}`))