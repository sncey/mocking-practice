const express = require("express");
const router = express.Router();
const sendEmail = require('../utils/email')

const ServiceRequestModel = require("../models/serviceRequest");

// This API endpoint is used to fetch all service requests from the database
// You may extend the code to have a filter functionality as well
router.get("/", async (req, res) => {
    const allServiceRequests = await ServiceRequestModel.find({});
    res.json(allServiceRequests);
});

// This API endpoint is used to create a new service request
// If the service request is completed successfully, we will send a confirmation email to the customer
router.post("/", async (req, res, next) => {
    const newServiceRequestData = req.body;
    try {
        const newServiceRequest = await ServiceRequestModel.create(newServiceRequestData);
        if (newServiceRequest) {
            // Call your email util function here to send an email to the customer
            const receiverEmail = newServiceRequest.email
            const subject = "Service Request Confirmation";
            const message = "Your service request has been received.";

            try {
                await sendEmail(receiverEmail, subject, message) 
                newServiceRequest.requestStatus = "Completed"
                res.status(201).json(newServiceRequest)
            } catch (error) {
                next(error)
            }
        } else {
            res.status(422).json({ message: "Failed to create service request." });
            return;
          }
    } catch(err) {
        res.status(422).json({ message: err.message });
        return;
    }
});

module.exports = router;
