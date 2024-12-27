const tf = require('@tensorflow/tfjs-node');
async function loadModel() {
    return tf.loadGraphModel('https://storage.googleapis.com/submissionmlgc-8ifarrel-bucket/model.json');
}
module.exports = loadModel;