const predictClassification = require("../services/InferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

const MAX_FILE_SIZE = 1000000;

async function postPredictHandler(request, h) {
  const { image } = request.payload;

  if (image.hapi.headers['content-length'] > MAX_FILE_SIZE) {
    return h.response({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    }).code(413);
  }

  const { model } = request.server.app;
  let confidenceScore, label, suggestion;

  try {
    ({ confidenceScore, label, suggestion } = await predictClassification(
      model,
      image
    ));
  } catch (error) {
    return h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    }).code(400);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: label,
    suggestion: suggestion,
    createdAt: createdAt,
  };

  await storeData(id, data);

  const response = h.response({
    status: "success",
    message:
      confidenceScore > 99
        ? "Model is predicted successfully"
        : "Model is predicted successfully but under threshold. Please use the correct picture",
    data,
  });
  response.code(201);
  return response;
}

async function predictHistories(request, h) {
  const { model } = request.server.app;
  const { Firestore } = require("@google-cloud/firestore");
  const db = new Firestore({
    projectId: "submissionmlgc-farrelsirah",
  });
  const predictCollection = db.collection("predictions");
  const snapshot = await predictCollection.get();
  const result = [];
  
  snapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      history: {
        result: doc.data().result,
        createdAt: doc.data().createdAt,
        suggestion: doc.data().suggestion,
        id: doc.data().id,
      },
    });
  });

  return h.response({
    status: "success",
    data: result,
  });
}

module.exports = { postPredictHandler, predictHistories };
