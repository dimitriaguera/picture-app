window.slideParticles = function (window, document, undefined) {

  var fn;
  var filter;
  var proceed;
  var modes;
  var filters;
  var nextSlideAnim;
  var matrixMethod;
  var oo = {};
  var getProto = Object.getPrototypeOf;


  // Defaults settings.
 var defaults = {
    height: 300,
    width: 300,
    background: '#fff',
    targetElement: 'dp-canvas',
    inputFileID: 'dp-fileinput',
    thumdnailsID: 'dp-thumb',
    panelID: 'dp-panel-settings',
    thumbWidth: 100,
    thumbHeight: 100,
    text: 'Hello World !',
    mass: 100,
    antiMass: -500,
    hoverMass: 5000,
    density: 1500,
    particleSize: 1,
    particleColor: '#000',
    textColor: '#fff',
    font: 'Arial',
    fontSize: 40,
    initialVelocity: 3,
    massX: 880,
    massY: 370,
    delay: 700,
    initialMode: 'modeShape',
    draw: false,
    stop: false,
    switchModeCallback: null,
    nextSlideAnim: 'drawMeAndExplode',
    modes: {
      modeForm: true
    }
  };

  /**
   * All registered modes.
   * 
   * Structure must be respected :
   * {
   *    modeName: {
   *        filters: {
   *            name: filterName - type string,
   *            param: [param1, param2...] - type array
   *        }
   *        proceed: [particleMethod1, particleMethod2...] - type array,
   *        matrixMethod: matrixMethodName - type string
   *    }  
   * }
   * 
   **** FILTERS
   * Each modes registered need an entry on filters object.
   * It permit to call corresponding filter function for each mode registered.
   * The corresponding filter fonction is called when matrix are built.
   * 
   * By default, there is only one mode : modeForm.
   * If a mode don't need filter, set {} to the mode name entry.
   * 
   * name : name of the filter function attach to filter object.
   * param : key targetting the settings parameter, passing as argument when filter function is called. Must be an Array in settings.
   * 
   * 
   **** PROCEED
   * For each mode, register all methods to apply for eache Particles instance in the loop.
   * Must be a Particles method.
   * -----> see DiapPart.prototype.partProceed
   * 
   * 
   **** MATRIXMETHOD
   * For each mode, register the Matrix method called to create the matrix (2 dimentional array).
   * 
   */
  modes = {};

  /**
   * All image filters functions.
   * 
   */
  filter = {};

  /**
   * All slide transition functions.
   * 
   */
  nextSlideAnim = {};

  // Matrix class object.
  function Matrix(instance, input, customSize) {
    this.instance = instance;
    this.type = typeof input !== 'string' ? 'picture' : 'text';
    this.picture = input;
    this.canvas = this.instance.getCanvas(customSize);
    this.context = this.instance.getContext2D(this.canvas);
    this.size = typeof input !== 'string' ? this.instance.getImageSize(input, customSize) : { x: 0, y: 0, w: 0, h: 0 };
    this.matrix = this.buildAllMatrix();
  }

  Matrix.prototype = {

    // Clear matrix's canvas.
    clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // Return matrix's canva's image data.
    getPixels: function () {

      this.clear();

      switch (this.type) {

        case 'picture':
          this.context.drawImage(this.picture, this.size.x, this.size.y, this.size.w, this.size.h);
          break;

        case 'text':
          this.setText();
          break;

        default:
          return false;
      }

      if (!this.size.w && !this.size.h) return false;

      return this.context.getImageData(this.size.x, this.size.y, this.size.w, this.size.h);
    },

    // Draw text in canvas.
    setText: function () {

      // Clear useless spaces in string to draw.
      var cleared = this.picture.trim();

      // If string empty, set size to 0 to avoid matrix calculation, and clear matrix.
      if (cleared === "") {
        this.size.x = 0;
        this.size.y = 0;
        this.size.w = 0;
        this.size.h = 0;
        this.clearMatrix();
        return false;
      }

      var i,
          w = 0,
          x = 20,
          y = 80,
          lines = this.picture.split("&#x5C;"),
          // Split text in array for each end of line.
      fontSize = this.instance.settings.fontSize;

      this.context.font = fontSize + "px " + this.instance.settings.font;
      this.context.fillStyle = this.instance.settings.textColor;
      this.context.textAlign = "left";

      // Draw line by line.
      for (i = 0; i < lines.length; i++) {
        this.context.fillText(lines[i], x, y + i * fontSize);
        w = Math.max(w, Math.floor(this.context.measureText(lines[i]).width));
      }

      // Set size object, to calculate targeted zone on the matrix.
      this.size.x = Math.max(x, this.size.x);
      this.size.y = Math.max(y - fontSize, this.size.y);
      this.size.w = Math.max(w + fontSize, this.size.w);
      this.size.h = Math.max(fontSize * i + fontSize, this.size.h);
    },

    // Apply filter's name with argArray.
    applyFilter: function (name, argArray) {

      var p = this.getPixels();

      // If filter doesn't exist, or no name, stop process.
      //if ( filter[name] === undefined ) throw new Error("filter '" + name +"' does'nt exist as filters method.");
      if (!filter[name]) return;

      // Get image data pixels.
      var i,
          args = [p];
      var pixels;

      // Construct args array.
      for (i = 0; i < argArray.length; i++) {
        args.push(argArray[i]);
      }

      // Apply filter.
      p = filter[name].apply(null, args);

      // Set new image data on canvas.
      this.context.putImageData(p, this.size.x, this.size.y);
    },

    // Create and store one matrix per mode registered, if instance.settings.modes[mode_name] is true.
    buildAllMatrix: function () {
      var m,
          mA = {};
      for (var mode in modes) {
        if (!this.instance.settings.modes[mode]) continue;
        m = this.creaMatrix();
        this.applyFilter(modes[mode].filters.name, this.instance.settings[modes[mode].filters.param]);
        this[modes[mode].matrixMethod](m, 1);
        mA[mode] = m;
      }
      return mA;
    },

    // Return active matrix.
    getMatrix: function () {
      return this.matrix[this.instance.mode] || false;
    },

    // Create matrix.
    creaMatrix: function () {
      var a = this.instance.settings.width,
          b = this.instance.settings.height,
          mat = new Array(a),
          i,
          j;
      for (i = 0; i < a; i++) {
        mat[i] = new Array(b);
        for (j = 0; j < b; j++) {
          mat[i][j] = 0;
        }
      }
      return mat;
    },

    // Set all matrix values to value or 0;
    clearMatrix: function (value) {
      var i,
          j,
          l,
          m,
          v,
          matrix = this.getMatrix();
      v = value || 0;
      l = matrix.length;
      m = matrix[0].length;
      for (i = 0; i < l; i++) {
        for (j = 0; j < m; j++) {
          matrix[i][j] = v;
        }
      }
    },

    // Create canvas thumbnails of the picture store on this Matrix.
    renderThumbnails: function (target, filter) {
      var self = this;

      // Create new Matrix for this thumb.
      var m = new Matrix(this.instance, this.picture, { w: this.instance.settings.thumbWidth, h: this.instance.settings.thumbHeight });

      // Apply filter.
      if (filter) {
        m.applyFilter(modes[this.instance.mode].filters.name, this.settings[modes[this.instance.mode].filters.param]);
      }
      // Apply style.
      m.canvas.style.cursor = 'pointer';

      // Apply click event on the thumb's canvas that fire the DiapPart's instance active index to coresponding Matrix.
      m.canvas.onclick = function (matrix) {
        return function (e) {
          self.instance.goTo(matrix);
        };
      }(m);

      // Store Matrix's instance of the thumb in an array.
      this.instance.thumbOriginalTab.push(m);

      // Inject thumb's canvas in the DOM.
      fn.append(target, m.canvas);

      return m;
    }
  };

  /**
   * DiapPart constructor.
   * A DiapParet instance must be created and initialized to create slideshow.
   *
   */

  function DiapPart() {
    this.settings = fn.simpleExtend({}, defaults);
    this.matrixTab = [];
    this.thumbOriginalTab = [];
    this.particles = [];
    this.champs = [];
    this.massActive = this.settings.mass;
    this.mode = this.settings.initialMode;
    this.liberation = false;
    this.activeIndex = null;
    this.canvas = this.getCanvas();
    this.context = this.getContext2D(this.canvas);
  }

  DiapPart.prototype = {

    // Initialize DiapPart instance.
    init: function (options) {

      // Store settings.
      fn.simpleExtend(this.settings, options);

      // Inject canvas on DOM.
      fn.append(this.settings.targetElement, this.canvas);

      // Apply style to canvas element.
      this.canvas.style.backgroundColor = this.settings.background;

      // Set mass initial coords to canva's center.
      this.centerMass();

      // Create the mass.
      this.champs.push(new Mass(new Vector(this.settings.massX, this.settings.massY), this.settings.mass));

      // Start the loop.
      this.loop();
    },

    // Set options to settings.
    set: function (options) {
      fn.simpleExtend(this.settings, options);
    },

    // Create new slide, according to input value : Image or String.
    createSlide: function (input, customSize) {

      // Create the Matrix instance according to input.
      var m = new Matrix(this, input, customSize);

      // Set active index to 0 if it's null.
      this.activeIndex = this.activeIndex === null ? 0 : this.activeIndex;
      this.matrixTab.push(m);
      return m;
    },

    // Create and return new Vector instance. Usefull for Particles methods extends via registerMode.
    getNewVector: function (x, y) {
      return new Vector(x, y);
    },

    // Create and return canvas element. If no size specified, take instance's settings size.
    getCanvas: function (size) {
      var canvas = document.createElement('canvas');
      canvas.height = this.settings.height;
      canvas.width = this.settings.width;

      return canvas;
    },

    // Create and return context for canvas.
    getContext2D: function (canvas) {
      return canvas.getContext('2d');
    },

    // Return coords, height and width of the img resized according to size arg, or instance's canvas size. 
    getImageSize: function (img, size) {
      var w = img.width,
          h = img.height,
          cw = size ? size.w : this.canvas.width,
          ch = size ? size.h : this.canvas.height,
          ratio = w / h;

      if (w >= h && w > cw) {
        w = cw;
        h = Math.round(w / ratio);
      } else {
        if (h > ch) {
          h = ch;
          w = Math.round(h * ratio);
        }
      }

      return {
        x: Math.round((cw - w) / 2),
        y: Math.round((ch - h) / 2),
        w: w,
        h: h
      };
    },

    // Method to pass as onchange event function in files input.
    load: function (e, thumb) {

      var i,
          self = this;
      var files = e.target ? e.target.files : e;
      var th = thumb === 'false' ? false : true;

      // If no file selected, exit.
      if (!files || files.constructor !== Array && !files instanceof FileList) return console.log('No files matched');

      for (i = 0; i < files.length; i++) {

        var file = files[i];

        // If file comes from input files.
        if (file.type) {

          // If file is not an image, pass to next file.
          if (!file.type.match('image')) continue;

          var reader = new FileReader();

          // When file is loaded.
          reader.onload = function (event) {

            // Set image data.
            var src = event.target.result;

            // Load image.
            fn.loadImage.call(this, src, self, th);
          };
          // Load file.
          reader.readAsDataURL(file);
        } else {
          // If files is array of url.

          // Load image.
          fn.loadImage.call(this, file, self, th);
        }
      }
    },

    // Change instance's mode. Basically, it change methods to test each Particles, and matrix that's tested.
    switchMode: function (mode) {

      // Set mode.
      this.mode = mode;

      // Call callback if exist.
      if (typeof this.settings.switchModeCallback === 'function') {
        this.settings.switchModeCallback.call(this);
      }
    },

    // Create new mass and store on champ array.
    addMass: function (x, y, mass) {
      var m = new Mass(new Vector(x, y), mass);
      this.champs.push(m);
      return m;
    },

    // Set mass coords to canva's centger on instance's settings.
    centerMass: function () {
      this.settings.massX = this.canvas.width / 2;
      this.settings.massY = this.canvas.height / 2;
    },

    // Call particle methods in each loop, according to active mode and corresponding proceed settings.
    partProceed: function (particle) {
      var i,
          proceed = modes[this.mode].proceed,
          l = proceed.length;
      for (i = 0; i < l; i++) {
        particle[proceed[i]]();
      }
    },

    // Set activeIndex to matrix's thumb index.
    goTo: function (matrix) {
      this.callNextSlideAnim();
      this.activeIndex = this.thumbOriginalTab.indexOf(matrix);
    },

    // Method to add new switch matrix function.
    registerNextSlideAnim: function (name, fn) {
      if (typeof fn !== 'function' || typeof name !== 'string') {
        return console.log('Error, name required and must be type string, fn required and must be type function');
      }
      nextSlideAnim[name] = fn;
    },

    // Function called between old and new matrix active.
    callNextSlideAnim: function () {
      try {
        nextSlideAnim[this.settings.nextSlideAnim].call(this);
      } catch (e) {
        console.log(e.name + ' - ' + e.message);
      }
    },

    // Create new Particle, with random position and speed.
    creaParts: function () {
      if (this.particles.length < this.settings.density) {
        var i,
            nb = this.settings.density - this.particles.length;
        for (i = 0; i < nb; i++) {
          this.particles.push(new Particle(this, new Vector(Math.random() * this.canvas.width, Math.random() * this.canvas.height), new Vector(realRandom(this.settings.initialVelocity), realRandom(this.settings.initialVelocity)), new Vector(0, 0), 0, false));
        }
      }
    },

    // Proceed all particules.
    upgradeParts: function () {

      var currentParts = [],
          i,
          l = this.particles.length;

      for (i = 0; i < l; i++) {

        var particle = this.particles[i],
            pos = particle.position;

        // If particle out of canvas, forget it.
        if (pos.x >= this.canvas.width || pos.x <= 0 || pos.y >= this.canvas.height || pos.y <= 0) continue;

        // Proceed the particle.
        this.partProceed(particle);

        // Move the particle.
        particle.move();

        // Store the particle.
        currentParts.push(particle);
      }
      this.particles = currentParts;
    },

    // Draw particles in canvas.
    drawParts: function () {
      var i,
          n = this.particles.length;
      for (i = 0; i < n; i++) {
        var pos = this.particles[i].position;
        this.context.fillStyle = this.particles[i].color;
        this.context.fillRect(pos.x, pos.y, this.settings.particleSize, this.settings.particleSize);
      }
    },

    // Make free all particles.
    clearParts: function () {
      var i,
          l = this.particles.length;
      for (i = 0; i < l; i++) {
        this.particles[i].inForm = 0;
      }
    },

    // Clean canvas.
    clear: function () {
      if (!this.settings.draw) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    },

    // Loop's callback.
    queue: function () {
      var self = this;
      if (!this.settings.stop) {
        this.requestID = window.requestAnimationFrame(self.loop.bind(self));
      } else {
        window.cancelAnimationFrame(self.requestID);
        this.requestID = undefined;
      }
    },

    // Create and proceed new particles if missing.
    update: function () {
      this.creaParts();
      this.upgradeParts();
    },

    // Draw.
    draw: function () {
      this.drawParts();
    },

    // Loop.
    loop: function () {
      this.clear();
      this.update();
      this.draw();
      this.queue();
    },

    // Stop loop.
    stop: function () {
      this.settings.stop = true;
    },

    // Start loop.
    start: function () {
      this.settings.stop = false;
      this.loop();
    }

  };

  // Return random number. 
  function realRandom(max) {
    return Math.cos(Math.random() * Math.PI) * max;
  }

  // Vector elementary class object.
  function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  // Add vector to an other.
  Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
  };

  // Invert vector's direction.
  Vector.prototype.getInvert = function () {
    this.x = -1 * this.x;
    this.y = -1 * this.y;
  };

  // Get vector's length.
  Vector.prototype.getMagnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  // Get vector's radius.
  Vector.prototype.getAngle = function () {
    return Math.atan2(this.y, this.x);
  };

  // Get new vector according to length and radius.
  Vector.prototype.fromAngle = function (angle, magnitude) {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  };

  // Particle constructor.
  function Particle(instance, position, vitesse, acceleration) {
    this.instance = instance;
    this.position = position || new Vector(0, 0);
    this.vitesse = vitesse || new Vector(0, 0);
    this.acceleration = acceleration || new Vector(0, 0);
    this.color = this.instance.settings.particleColor;
    this.inForm = 0;
  }

  // Set new particle's position according to its acceleration and speed.
  Particle.prototype.move = function () {
    this.vitesse.add(this.acceleration);
    this.position.add(this.vitesse);
  };

  // Proceed particle according to existing mass.
  Particle.prototype.soumisChamp = function () {

    var mass = this.instance.massActive;

    // If no mass strength, return.
    if (!mass) return;

    // If particle has not flagged 'inForm'.
    if (this.inForm !== 1) {

      var totalAccelerationX = 0;
      var totalAccelerationY = 0;
      var l = this.instance.champs.length;

      // Proceed effect of all mass registered in champs array.
      for (var i = 0; i < l; i++) {
        var distX = this.instance.champs[i].position.x - this.position.x;
        var distY = this.instance.champs[i].position.y - this.position.y;
        var force = mass / Math.pow(distX * distX + distY * distY, 1.5);
        totalAccelerationX += distX * force;
        totalAccelerationY += distY * force;
      }

      // Set new acceleration vector.
      this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
    }
  };

  // Mass constructor.
  function Mass(point, mass) {
    this.position = point;
    this.setMass(mass);
  }

  Mass.prototype.setMass = function (mass) {
    this.mass = mass || 0;
    this.color = mass < 0 ? "#f00" : "#0f0";
  };

  /**
   * Utility functions.
   * 
   */
  var fn = {
    // Return viewport size.
    getViewport: function () {
      return {
        w: document.body.clientWidth,
        h: document.body.clientHeight
      };
    },

    getTargetViewport: function (target) {
      var elmt = document.getElementById(target);
      return {
        w: elmt.offsetWidth,
        h: elmt.offsetHeight
      };
    },

    // Append element in target.
    append: function (target, element) {
      if (typeof target === 'string') {
        document.getElementById(target).appendChild(element);
      } else {
        target.appendChild(element);
      }
    },

    // Test if target is plain object. Thank you jQuery 3+ !
    isPlainObject: function (target) {
      var proto, Ctor;
      // Detect obvious negatives
      // Use toString instead of jQuery.type to catch host objects
      if (!target || oo.toString.call(target) !== "[object Object]") {
        return false;
      }
      proto = getProto(target);
      if (!proto) {
        return true;
      }
      // Objects with prototype are plain iff they were constructed by a global Object function
      Ctor = oo.hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor === "function" && oo.hasOwnProperty.call(Ctor.prototype, "isPrototypeOf");
    },

    // Deeply extend a object with b object properties.
    simpleExtend: function (a, b) {
      var clone,
          src,
          copy,
          isAnArray = false;
      for (var key in b) {

        src = a[key];
        copy = b[key];

        //Avoid infinite loop.
        if (a === copy) {
          continue;
        }

        if (b.hasOwnProperty(key)) {
          // If propertie is Array or Object.
          if (copy && (fn.isPlainObject(copy) || (isAnArray = Array.isArray.call(copy)))) {
            if (isAnArray) {
              isAnArray = false;
              clone = src && src.isArray ? src : [];
            } else {
              clone = src && fn.isPlainObject(src) ? src : {};
            }
            // Create new Array or Object, never reference it.
            a[key] = fn.simpleExtend(clone, copy);
          } else {
            a[key] = copy;
          }
        }
      }
      return a;
    },

    loadImage: function (src, self, thumb) {

      var img = new Image();
      // When image is loaded.
      img.onload = function () {

        // Create slide, with Image input.
        var m = self.createSlide(this);

        if (!thumb) return;

        // Create and store thumb.
        m.renderThumbnails(self.settings.thumdnailsID, false);
      };
      // Load img.
      img.src = src;
    }
  };

  /**
   * PUBLIC METHODS.
   * 
   */

  return {

    // Entry point to create new slide instance.
    getInstance: function (options) {
      var i = new DiapPart();
      i.init(options);
      return i;
    },

    // Call it to extend core.
    registerMode: function (name, param) {

      // Check if mode's name is free.
      if (defaults.modes[name]) throw new Error("Name space for '" + name + "' already exist. Choose an other module name.");

      // Register new mode.
      defaults.modes[name] = true;

      // Extend defaults, filter, Particles and Matrix class.
      fn.simpleExtend(defaults, param.options);
      fn.simpleExtend(filter, param.filter);
      fn.simpleExtend(DiapPart.prototype, param.proto);
      fn.simpleExtend(Particle.prototype, param.proto_particles);
      fn.simpleExtend(Matrix.prototype, param.proto_matrix);

      // Register new mode filters, proceed and matrixMethod.
      modes[name] = param.modeData;
    },

    // Call it to extend nextSlideAnim.
    registerTransition: function (obj) {
      fn.simpleExtend(nextSlideAnim, obj);
    }
  };
}(this, this.document);
slideParticles.registerMode('modeShape', {
  options: {
    thresholdNB: [128]
  },
  proto: {},
  proto_particles: {
    // Proceed particle according to matrix of type 'value'. Called in modeForm.
    soumisForm: function () {

      // If liberation flag, make the particle free.
      if (this.instance.liberation) {
        this.inForm = 0;
        return;
      }

      // Get particle position.
      var testX = Math.floor(this.position.x);
      var testY = Math.floor(this.position.y);

      // Check matrix value according to particle's position.
      var value = this.instance.activeIndex !== null ? this.instance.matrixTab[this.instance.activeIndex].getMatrix()[testX][testY] : 0;

      // If particle is inside a 'white zone'.
      if (value !== 0) {

        // If particles just come into the 'white zone'.
        if (this.inForm !== 1) {

          // Up the form flag.
          this.inForm = 1;

          // Slow the particle.
          this.vitesse = this.instance.getNewVector(this.vitesse.x * 0.2, this.vitesse.y * 0.2);

          // Cut the acceleration.
          this.acceleration = this.instance.getNewVector(0, 0);
        }
      }

      // If particle is not inside 'white zone'.
      else {

          // If the particle just get out the zone.
          if (this.inForm === 1) {

            // It's not free : invert speed.
            this.vitesse.getInvert();
          }
        }
    }
  },
  proto_matrix: {
    // Construct matrix, according to canvas's image data values.
    // If image data pixel is white, corresponding matrix case is set too value.
    // If image data pixel is black, corresponding matrix case is set to 0.
    valueMatrix: function (matrix, value) {
      var a = this.size.x,
          b = Math.min(Math.floor(a + this.size.w), matrix.length),
          c = this.size.y,
          d = Math.min(Math.floor(c + this.size.h), matrix[0].length);
      if (matrix.length < a || matrix[0].length < d) return;

      var i,
          j,
          p = this.context.getImageData(0, 0, this.instance.canvas.width, this.instance.canvas.height).data;

      for (i = a; i < b; i++) {
        for (j = c; j < d; j++) {
          var pix = p[(this.instance.canvas.width * j + i) * 4];
          matrix[i][j] = pix === 255 ? value : 0;
        }
      }
    }
  },
  filter: {
    // Turn colored picture on black and white. Used for modeForm.
    blackAndWhite: function (pixels, threshold) {
      if (!pixels) return pixels;
      var i,
          r,
          g,
          b,
          v,
          d = pixels.data;
      for (i = 0; i < d.length; i += 4) {
        r = d[i];
        g = d[i + 1];
        b = d[i + 2];
        v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold ? 255 : 0;
        d[i] = d[i + 1] = d[i + 2] = v;
      }
      return pixels;
    }
  },
  modeData: {
    filters: {
      name: 'blackAndWhite',
      param: 'thresholdNB'
    },
    proceed: ['soumisChamp', 'soumisForm'],
    matrixMethod: 'valueMatrix'
  }
});
slideParticles.registerMode('modeColor', {
  options: {},
  proto: {},
  proto_particles: {
    soumisColor: function () {
      this.inForm = 0;
      var testX = Math.floor(this.position.x);
      var testY = Math.floor(this.position.y);
      this.color = this.instance.activeIndex !== null ? this.instance.matrixTab[this.instance.activeIndex].getMatrix()[testX][testY] : this.instance.settings.particleColor;
    }
  },
  proto_matrix: {
    colorMatrix: function (matrix) {

      var i,
          j,
          r,
          g,
          b,
          p = this.context.getImageData(0, 0, this.instance.canvas.width, this.instance.canvas.height).data;

      for (i = 0; i < this.canvas.width; i++) {
        for (j = 0; j < this.canvas.height; j++) {
          r = p[(this.instance.canvas.width * j + i) * 4];
          g = p[(this.instance.canvas.width * j + i) * 4 + 1];
          b = p[(this.instance.canvas.width * j + i) * 4 + 2];
          matrix[i][j] = 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
        }
      }
    }
  },
  filter: {},
  modeData: {
    filters: {
      name: null,
      param: null
    },
    proceed: ['soumisChamp', 'soumisColor'],
    matrixMethod: 'colorMatrix'
  }
});
slideParticles.registerTransition({

      // Make particles free for short delay.
      liberationParts: function (delay) {
            var self = this;
            var d = delay || this.settings.delay;

            // Make free parts from current form value.
            this.clearParts();

            // Particles are free from matrix of type 'value'.
            this.liberation = !this.liberation;

            // Mass strength is inverted.
            this.massActive = this.settings.antiMass;

            // When delay's over, whe return to normal mass strength and particles behavior.
            setTimeout(function () {
                  self.massActive = self.settings.mass;
                  self.liberation = !self.liberation;
            }, d);
      },
      // Other custom anim.
      drawMeAndExplode: function (delay) {
            var self = this;
            var d = delay || this.settings.delay;

            // Make free parts from their inShape value.
            this.clearParts();
            this.switchMode('modeShape');
            // Particles are free from matrix of type 'value'.
            this.liberation = !this.liberation;

            //this.settings.draw = false;
            self.settings.draw = true;

            setTimeout(function () {
                  self.switchMode('modeColor');
            }, d);
      }
});
