const tf = require('@tensorflow/tfjs-node');
async function loadModel() {
    return tf.loadGraphModel('https://storage.cloud.google.com/submissionmlgc-8ifarrel-bucket/model.json');
}
module.exports = loadModel;