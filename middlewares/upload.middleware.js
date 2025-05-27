const logger = require('../utils/logger.util')
const { upload } = require('../configs/app.config')

function handleAttachmentUpload(req, res, next) {
  upload.fields([{ name: 'attachments' }])(req, res, err => {
    if (err) {
      logger.error(err?.message || err)

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).send('Payload Too Large')
      }

      return res.status(400).send('Bad Request')
    }

    return next()
  })
}

module.exports = {
  handleAttachmentUpload,
}
