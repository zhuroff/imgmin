import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import Jimp from 'jimp'
import sizeOf from 'image-size'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const srcFolder = path.join(__dirname, 'src')
const data = fs.readdirSync(srcFolder, { withFileTypes: true })
const horizontalSize = 1200
const verticalSize = 600
const imgQuality = 80

const getWidthHeight = dimensions => {
  if (dimensions.width < horizontalSize) {
    if (dimensions.width >= dimensions.height) {
      return [dimensions.width, Jimp.AUTO]
    } else {
      return [Jimp.AUTO, dimensions.height]
    }
  } else {
    if (dimensions.width >= dimensions.height) {
      return [horizontalSize, Jimp.AUTO]
    } else {
      return [Jimp.AUTO, verticalSize]
    }
  }
}

const errorLog = (message, error) => {
  console.error(message, error)
}

data.forEach(el => {
  const name = el.name.split('.').slice(0, -1).join('.')
  const ext = el.name.split('.').pop()

  sizeOf(`./src/${el.name}`, (error, dimensions) => {
    if (error) {
      errorLog('sizeOf error', error)
    }

    const [width, height] = getWidthHeight(dimensions)

    Jimp.read(`./src/${el.name}`)
      .then(image => {
        image.resize(width, height)
          .quality(imgQuality)
          .write(`./dist/${ext === 'jpg' ? el.name : `${name}.jpg`}`, error => {
            if (error) {
              errorLog('Write error: ', error)
            }
          })
      })
      .catch(error => {
        errorLog('Read error', error)
      })
    })
})