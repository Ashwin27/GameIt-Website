/* Modernizr 2.6.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-teststyles-prefixes
 */
;window.Modernizr=function(a,b,c){function v(a){i.cssText=a}function w(a,b){return v(l.join(a+";")+(b||""))}function x(a,b){return typeof a===b}function y(a,b){return!!~(""+a).indexOf(b)}function z(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:x(f,"function")?f.bind(d||b):f}return!1}var d="2.6.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m={},n={},o={},p=[],q=p.slice,r,s=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},t={}.hasOwnProperty,u;!x(t,"undefined")&&!x(t.call,"undefined")?u=function(a,b){return t.call(a,b)}:u=function(a,b){return b in a&&x(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e}),m.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:s(["@media (",l.join("touch-enabled),("),g,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c};for(var A in m)u(m,A)&&(r=A.toLowerCase(),e[r]=m[A](),p.push((e[r]?"":"no-")+r));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)u(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},v(""),h=j=null,e._version=d,e._prefixes=l,e.testStyles=s,e}(this,this.document);

(function($)
{

	/*******************************************************
		APP
	********************************************************/
	var App = window.App =
	{
		options: {

		},

		run: function(options)
		{
			var app = this;

			app.options = $.extend(true, app.options, options);

			$(window).load(function() {
				show();
				//setTimeout(show, 2000);
			});

			$('#video')
				.each(function(index, el)
				{
					var $this = $(this);
					var data = $this.data();

					var width = data.width;
					var height = data.height;
					var ratio = width / height;

					var html = '\
						<video autoplay loop preload="auto"> \
							<source src="'+ data.url +'.mp4?v=2" type="video/mp4" /> \
							<source src="'+ data.url +'.webm" type="video/webm" /> \
							<source src="'+ data.url +'.ogv" type="video/ogg" /> \
						</video> \
					';

					if(Modernizr.touch)
					{
						html = '<img src="'+ data.image +'" alt="" />'
					}

					var $video = $(html).appendTo(this);

					$(window)
						.on('resize.bg', function(event)
						{
							event.preventDefault();

							if( $(this).height() > 1013 )
							{
								$('#section-intro').height(1000);
							}
							else
							{
								$('#section-intro').height( $(this).height() - 13 );
							}

							var wWidth = $this.width();
							var wHeight = $this.height();
							var wRatio = wWidth / wHeight;

							if(ratio > wRatio)
							{
								var w = wHeight / height * width;

								$video
									.css({'height': wHeight, 'width': w, 'margin-top': -wHeight/2, 'margin-left': -w/2, 'top': '50%', 'left': '50%'});
							}
							else
							{
								var h = wWidth / width * height;

								$video
									.css({'height': h, 'width': wWidth, 'margin-top': -h/2, 'margin-left': -wWidth/2, 'top': '50%', 'left': '50%'});
							}

						})
						.trigger('resize.bg')




				});

			function show() {
				$('#loader')
					.fadeOut(800, function(){
						$('#loader-wrap')
							.fadeTo(300, 1)
					});
			}

			$('#video').each(function()
			{
				this.volume = 0


			})

			// Box2DWeb implementation
			var b2Vec2 = Box2D.Common.Math.b2Vec2;
			var b2BodyDef = Box2D.Dynamics.b2BodyDef;
			var b2Body = Box2D.Dynamics.b2Body;
			var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
			var b2Fixture = Box2D.Dynamics.b2Fixture;
			var b2World = Box2D.Dynamics.b2World;
			var b2MassData = Box2D.Collision.Shapes.b2MassData;
			var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
			var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
			var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;


			var Physics = window.Physics = function(element,scale) {
				var gravity = new b2Vec2(0,9.8);
				this.world = new b2World(gravity, true);
				this.element = element;
				this.context = element.getContext("2d");
				this.scale = scale || 20;
				this.dtRemaining = 0;
				this.stepAmount = 1/60;
			};

			Physics.prototype.debug = function() {
				this.debugDraw = new b2DebugDraw();
				this.debugDraw.SetSprite(this.context);
				this.debugDraw.SetDrawScale(this.scale);
				this.debugDraw.SetFillAlpha(0.3);
				this.debugDraw.SetLineThickness(1.0);
				this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
				this.world.SetDebugDraw(this.debugDraw);
			};

			Physics.prototype.step = function(dt) {
				this.dtRemaining += dt;
				while(this.dtRemaining > this.stepAmount) {
					this.dtRemaining -= this.stepAmount;
					this.world.Step(this.stepAmount,
									10, // velocity iterations
									10);// position iterations
				}
				if(this.debugDraw) {
					this.world.DrawDebugData();
				} else {
					var obj = this.world.GetBodyList();
					this.context.clearRect(0,0,this.element.width,this.element.height);

					this.context.save();
					this.context.scale(this.scale,this.scale);
					while(obj) {
						var body = obj.GetUserData();
						if(body) {  body.draw(this.context); }

						obj = obj.GetNext();
					}
					this.context.restore();
				}
			};


			Physics.prototype.click = function(callback) {
				var self = this;

				function handleClick(e) {
					e.preventDefault();

					var point = {
						x: (e.offsetX || e.layerX) / self.scale,
						y: (e.offsetY || e.layerY) / self.scale
					};

					self.world.QueryPoint(function(fixture) {
						callback(fixture.GetBody(),
						fixture,
						point);
					},point);
				}

				this.element.addEventListener("click",handleClick);
				this.element.addEventListener("touchstart",handleClick);
			};

			var Body = window.Body = function(physics,details) {
				this.details = details = details || {};

				// Create the definition
				this.definition = new b2BodyDef();

				// Set up the definition
				for(var k in this.definitionDefaults) {
					this.definition[k] = details[k] || this.definitionDefaults[k];
				}
				this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
				this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
				this.definition.userData = this;
				this.definition.type = details.type == "static" ? b2Body.b2_staticBody :
				b2Body.b2_dynamicBody;

				// Create the Body
				this.body = physics.world.CreateBody(this.definition);

				// Create the fixture
				this.fixtureDef = new b2FixtureDef();
				for(var l in this.fixtureDefaults) {
					this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
				}


				details.shape = details.shape || this.defaults.shape;

				switch(details.shape) {
					case "circle":
						details.radius = details.radius || this.defaults.radius;
						this.fixtureDef.shape = new b2CircleShape(details.radius);
						break;
					case "polygon":
						this.fixtureDef.shape = new b2PolygonShape();
						this.fixtureDef.shape.SetAsArray(details.points,details.points.length);
						break;
					case "block":
					default:
						details.width = details.width || this.defaults.width;
						details.height = details.height || this.defaults.height;

						this.fixtureDef.shape = new b2PolygonShape();
						this.fixtureDef.shape.SetAsBox(details.width/2,
						details.height/2);
						break;
				}

				this.body.CreateFixture(this.fixtureDef);
			};


			Body.prototype.defaults = {
				shape: "block",
				width: 4,
				height: 4,
				radius: 1
			};

			Body.prototype.fixtureDefaults = {
				density: 2,
				friction: 1,
				restitution: 0.2
			};

			Body.prototype.definitionDefaults = {
				active: true,
				allowSleep: true,
				angle: 0,
				angularVelocity: 0,
				awake: true,
				bullet: false,
				fixedRotation: false
			};


			Body.prototype.draw = function(context) {
				var pos = this.body.GetPosition(),
				angle = this.body.GetAngle();

				context.save();
				context.translate(pos.x,pos.y);
				context.rotate(angle);


				if(this.details.color) {
					context.fillStyle = this.details.color;

					switch(this.details.shape) {
						case "circle":
							context.beginPath();
							context.arc(0,0,this.details.radius,0,Math.PI*2);
							context.fill();
							break;
						case "polygon":
							var points = this.details.points;
							context.beginPath();
							context.moveTo(points[0].x,points[0].y);
							for(var i=1;i<points.length;i++) {
								context.lineTo(points[i].x,points[i].y);
							}
							context.fill();
							break;
						case "block":
							context.fillRect(-this.details.width/2,
							-this.details.height/2,
							this.details.width,
							this.details.height);
						default:
							break;
					}
				}

				if(this.details.image) {
					context.drawImage(
						this.details.image,
						-this.details.width/2,
						-this.details.height/2,
						this.details.width,
						this.details.height
					);
				}

				context.restore();

			}


			var physics,
			lastFrame = new Date().getTime();

			window.gameLoop = function() {
				var tm = new Date().getTime();
				requestAnimationFrame(gameLoop);
				var dt = (tm - lastFrame) / 1000;
				if(dt > 1/15) { dt = 1/15; }
				physics.step(dt);
				lastFrame = tm;
			};

			function initAnimation(canvasId) {
				var imgRed = new Image(),
					imgGreen = new Image(),
					imgPurple = new Image(),
					imgOrange = new Image(),
					images = [imgRed, imgGreen, imgPurple, imgOrange];

				// Wait for the image to load
				imgRed.addEventListener("load", function() {

					physics = window.physics = new Physics(document.getElementById(canvasId), 30);

					// Create some walls
					new Body(physics, { color: "gray", type: "static", x: -0.5, y: 0, height: 56,  width: 1 });
					new Body(physics, { color: "gray", type: "static", x: 38.9, y: 0, height: 56,  width: 1});
					new Body(physics, { color: "gray", type: "static", x: 0, y: -0.5, height: 1, width: 77 });
					new Body(physics, { color: "gray", type: "static", x: 0, y: 28.33, height: 1, width: 77 });

					new Body(physics, { color: '#494f60', type: 'static', x: 4.3, y: 16.7, width: 11.5, height: 0.33, angle: 53 * (Math.PI/180) });
					new Body(physics, { color: '#494f60', type: 'static', x: 7, y: 15, width: 11.5, height: 0.33, angle: 53 * (Math.PI/180) });
					new Body(physics, { color: 'transparent', type: 'static', x: 575/physics.scale, y: 310/physics.scale, width: 180/physics.scale, height: 60/physics.scale });

					for (var i=0;i<6;i++) {
						var xRand = Math.ceil(physics.element.width/30 * Math.random()),
						key = Math.ceil(Math.random()*4 - 1);

						new Body(physics, { image: images[key], shape: 'circle', radius: 1.27, x: xRand, y: 1.27, width: 2.54, height: 2.54 });
					}

					new Body(physics, { color: "#494f60", type: 'static', shape: "polygon", points: [ { x: -6.17, y: 2.54 }, { x: 1, y: -2.3 },{ x: 3.94, y: 0.67 }   ], x: 22.5, y: 19.7 });

					new Body(physics, { color:"#535a6c", type: 'static', shape: 'circle', radius: 0.25, x: 31.4, y: 12.7 });

					var anchor = new Body(physics, { color:"#3e4352", type: 'static', shape: 'circle', radius: 0.5, x: 31.4, y: 12.7 }),
					bridge = new Body(physics, { color: '#494f60', x: 31.4, y: 12.7, width: 9, height: 0.33, angle: -15 * (Math.PI/180) });

					def = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
					def.Initialize(anchor.body, bridge.body, new b2Vec2(31.4,12.7));
					var joint = physics.world.CreateJoint(def);
					var counter = 0;

					$('#section-getapp')
						.on('click', '.row-main', function(e) {
							if (!$(e.target).closest('.btn').length)
							{
								e.preventDefault();

								if(counter < 80)
								{
									var xPos = (e.pageX - $(this).offset().left) / 30,
									yPos = (e.pageY - $(this).offset().top) / 30,
									key = Math.ceil(Math.random()*4 - 1);

									new Body(physics, { image: images[key], shape: 'circle', radius: 1.27, x: xPos, y: yPos, width: 2.54, height: 2.54 });
								}
								counter++;
							}
						});

					requestAnimationFrame(gameLoop);
				});

				images[0].src = './img/illust/ball-red.png';
				images[1].src = './img/illust/ball-green.png';
				images[2].src = './img/illust/ball-purple.png';
				images[3].src = './img/illust/ball-orange.png';

			}

			// Lastly, add in the `requestAnimationFrame` shim, if necessary. Does nothing
			// if `requestAnimationFrame` is already on the `window` object.
			(function() {
				var lastTime = 0;
				var vendors = ['ms', 'moz', 'webkit', 'o'];
				for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
					window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
					window.cancelAnimationFrame =
					window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
				}

				if (!window.requestAnimationFrame) {
					window.requestAnimationFrame = function(callback, element) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
						lastTime = currTime + timeToCall;
						return id;
					};
				}

				if (!window.cancelAnimationFrame) {
					window.cancelAnimationFrame = function(id) {
						clearTimeout(id);
					};
				}
			}());

			// Waypoints
			$('#section-logos .row-main, #section-about .box-about, #section-testimonials .row-main, #section-getapp .row-main')
				.waypoint({
					triggerOnce: true,
					handler: function(direction)
					{
						if (direction == 'down')
						{
							var $this = $(this);

							$this
								.fadeTo(400, 1, function(){
									if ($this.closest('.box-section').hasClass('section-getapp'))
									{
										initAnimation('balls-canvas');
									}
								});
						}
					},
					offset: '75%'
				});

			$('#section-intro')
				.on('click', '#learn-more', function(e){
					e.preventDefault();

					$('html,body')
						.animate({ scrollTop: $('#section-about').offset().top });
				});

			// Slideshow
			$('.section-testimonials .scroll')
				.each(function(i)
				{
					var $slider = $(this),
						Carousel;

					// Set Carousel
					var options = $.extend({
						scroll: 1,
						animate: 500,
						fullscreen: false,
						repeat: false,
						infinite: false,
						pagerPages: $(this).find('.paging'),
						timeout: 0,
					}, options || {});

					Carousel = new sk.widgets.Carousel( $slider.find('ul'), options ).init();

					// carousel swipe
					$slider.find('.sk-carousel')
						.swipe({
							triggerOnTouchEnd : true,
							swipeStatus : function(event, phase, direction, distance)
							{
								if ( phase =="end" )
								{
									if (direction == "right")
									{
										Carousel.pager.prev();
									}
									else if (direction == "left")
									{
										Carousel.pager.next();
									}
								}
							},
							allowPageScroll:"vertical",
							threshold:75
						});

				});

			// Beautify OL
			$('ol[start]')
				.css('counter-reset', function()
				{
					 return 'item ' + ( $(this).prop('start') - 1 )
				})

			// ie 7 OL
			$('html.ie7 ol')
				.each(function(i)
				{
					var start = $(this).prop('start') * 1;

					$(this).find('li')
						.each(function(i)
						{
							$(this).prepend('<span class="ie-counter">' + (start + i) + '.</span>');
						});
				});

			// IE7 Before
			//$('html.ie7 .element').prepend('<b class="before" />');
			// IE7 After
			//$('html.ie7 .element').append('<b class="after" />');
		}
	};
})(jQuery)