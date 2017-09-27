void function ($) {
  $('input').on('change', function () {
    var file = this.files[0]
    if (file == null) return

    read(file)
      .then(load)
      .then(process)
      .catch(function (error) {
        console.error(error)
      })
  })

  function read (file) {
    var deferred = $.Deferred()
    var fileReader = new FileReader()
    fileReader.addEventListener('load', function (event) {
      deferred.resolve(event.target.result)
    })
    fileReader.addEventListener('error', function (event) {
      deferred.reject(Error(event.message))
    })
    fileReader.readAsDataURL(file)
    return deferred.promise()
  }

  function load (url) {
    var deferred = $.Deferred()
    var image = new Image()
    image.addEventListener('load', function (event) {
      deferred.resolve(image)
    })
    image.addEventListener('error', function (event) {
      deferred.reject(Error(event.message))
    })
    image.src = url
    return deferred.promise()
  }

  function compress (image) {
    var canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)
    return canvas.toDataURL('image/jpeg', .1)
  }

  function delay (duration, value) {
    var deferred = $.Deferred()
    setTimeout(function (deferred, value) {
      deferred.resolve(value)
    }, duration, deferred, value)
    return deferred.promise()
  }

  function process (image) {
    $('<li>').addClass('column is-one-quarter has-text-centered').append(image).prependTo('ul')
    return delay(1000, image).then(compress).then(load).then(process)
  }
} (jQuery.noConflict())
