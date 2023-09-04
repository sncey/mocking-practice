const request = require("supertest");
const app = require("../app");
const ServiceRequestModel = require("../models/serviceRequest");
const sendEmail = require("../utils/email");

// Mock the ServiceRequestModel.create method to simulate successful creation
jest.mock("../models/serviceRequest", () => ({
  create: jest.fn().mockResolvedValue({
    _id: "123456789",
    customerName: "John Doe",
    email: "johndoe@example.com",
    requestedAt: new Date(),
    requestStatus: "Pending",
  }),
}));

// Mock the sendEmail function to prevent sending actual emails during testing
jest.mock("../utils/email", () => jest.fn());

describe("POST /service-requests", () => {
  it("should create a new service request and send an email", async () => {
    // Send a POST request to create a new service request
    const response = await request(app)
      .post("/service-requests")
      .send({
        customerName: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "1234567890",
        requestType: "Repair",
      });

    // Assert the response status code
    expect(response.status).toBe(201);

    // Assert the response body
    expect(response.body).toEqual({
      _id: "123456789",
      customerName: "John Doe",
      email: "johndoe@example.com",
      requestedAt: expect.any(String),
      requestStatus: "Completed",
    });

    // Assert that the ServiceRequestModel.create method was called
    expect(ServiceRequestModel.create).toHaveBeenCalledWith({
      customerName: "John Doe",
      email: "johndoe@example.com",
      phoneNumber: "1234567890",
      requestType: "Repair",
    });

    // Assert that the sendEmail function was called
    expect(sendEmail).toHaveBeenCalledWith(
      "johndoe@example.com",
      "Service Request Confirmation",
      "Your service request has been received."
    ); 
  });
});
