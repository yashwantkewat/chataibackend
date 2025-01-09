const crypto = require('crypto');
const Response = require('../model/responseModel');

exports.storeResponse = async (req, res) => {
  try {
    const { userInput, aiResponse } = req.body;

    // Generate a unique ID using crypto
    const uniqueId = crypto.randomUUID();  // This works in Node.js environments

    const newResponse = new Response({
      _id: uniqueId,  // Set the generated unique ID
      userInput,
      aiResponse,
    });

    await newResponse.save();
    res.status(201).json({ message: 'Response saved successfully', data: newResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving response', error });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const responses = await Response.find();
    res.status(200).json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching responses', error });
  }
};

exports.getResponseById = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameter
    const response = await Response.findById(id);

    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching response by ID:', error);
    res.status(500).json({ message: 'Error fetching response by ID' });
  }
};
