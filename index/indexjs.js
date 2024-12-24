
      const settings = {
        particles: {
          length: 600, 
          duration: 1, 
          velocity: 300, 
          size: 30, 
          effect: 1, 
        },
      };

      let canvas = document.getElementById("canvas");
      let context = canvas.getContext("2d");

      let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

      // Resize canvas to fit screen
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      window.addEventListener("resize", resizeCanvas);
      resizeCanvas();

      canvas.addEventListener("mousemove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
      });

    
      class Point {
        constructor(x, y) {
          this.x = x || 0;
          this.y = y || 0;
        }
        clone() {
          return new Point(this.x, this.y);
        }
        length(length) {
          if (length === undefined) return Math.sqrt(this.x * this.x + this.y * this.y);
          this.normalize();
          this.x *= length;
          this.y *= length;
          return this;
        }
        normalize() {
          let length = this.length();
          this.x /= length;
          this.y /= length;
          return this;
        }
      }

     
      class Particle {
        constructor() {
          this.position = new Point();
          this.velocity = new Point();
          this.acceleration = new Point();
          this.age = 0;
        }
        initialize(x, y, dx, dy) {
          this.position.x = x;
          this.position.y = y;
          this.velocity.x = dx;
          this.velocity.y = dy;
          this.acceleration.x = dx * settings.particles.effect;
          this.acceleration.y = dy * settings.particles.effect;
          this.age = 0;
        }
        update(deltaTime) {
          this.position.x += this.velocity.x * deltaTime;
          this.position.y += this.velocity.y * deltaTime;
          this.velocity.x += this.acceleration.x * deltaTime;
          this.velocity.y += this.acceleration.y * deltaTime;
          this.age += deltaTime;
        }
        draw(context, image) {
          let size = image.width * (1 - this.age / settings.particles.duration);
          context.globalAlpha = 1 - this.age / settings.particles.duration;
          context.drawImage(
            image,
            this.position.x - size / 2,
            this.position.y - size / 2,
            size,
            size
          );
        }
      }

      
      class ParticlePool {
        constructor(length) {
          this.particles = Array.from({ length }, () => new Particle());
          this.firstActive = 0;
          this.firstFree = 0;
          this.duration = settings.particles.duration;
        }
        add(x, y, dx, dy) {
          this.particles[this.firstFree].initialize(x, y, dx, dy);
          this.firstFree = (this.firstFree + 1) % this.particles.length;
          if (this.firstFree === this.firstActive) this.firstActive = (this.firstActive + 1) % this.particles.length;
        }
        update(deltaTime) {
          for (let i = this.firstActive; i !== this.firstFree; i = (i + 1) % this.particles.length) {
            this.particles[i].update(deltaTime);
          }
          while (this.particles[this.firstActive].age >= this.duration && this.firstActive !== this.firstFree) {
            this.firstActive = (this.firstActive + 1) % this.particles.length;
          }
        }
        draw(context, image) {
          for (let i = this.firstActive; i !== this.firstFree; i = (i + 1) % this.particles.length) {
            this.particles[i].draw(context, image);
          }
        }
      }

      // macxami sp
      function pointOnHeart(t) {
        return new Point(
          160 * Math.pow(Math.sin(t), 3),
          130 * Math.cos(t) -
            50 * Math.cos(2 * t) -
            20 * Math.cos(3 * t) -
            10 * Math.cos(4 * t)
        );
      }

     
      function createHeartImage() {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        canvas.width = settings.particles.size;
        canvas.height = settings.particles.size;

        context.beginPath();
        for (let t = -Math.PI; t <= Math.PI; t += 0.01) {
          let point = pointOnHeart(t);
          let x = settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
          let y = settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
          if (t === -Math.PI) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.fillStyle = "#F700FFFF";
        context.fill();

        let image = new Image();
        image.src = canvas.toDataURL();
        return image;
      }

      let particles = new ParticlePool(settings.particles.length);
      let particleRate = settings.particles.length / settings.particles.duration;
      let heartImage = createHeartImage();

      let lastTime;

      function render() {
        let currentTime = Date.now() / 1000;
        let deltaTime = currentTime - (lastTime || currentTime);
        lastTime = currentTime;

        context.clearRect(0, 0, canvas.width, canvas.height);

        let amount = particleRate * deltaTime;
        for (let i = 0; i < amount; i++) {
          let pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
          let dir = pos.clone().length(settings.particles.velocity);
          particles.add(
            mouse.x + pos.x,
            mouse.y - pos.y,
            dir.x,
            -dir.y
          );
        }

        particles.update(deltaTime);
        particles.draw(context, heartImage);

        requestAnimationFrame(render);
      }


      render();
   