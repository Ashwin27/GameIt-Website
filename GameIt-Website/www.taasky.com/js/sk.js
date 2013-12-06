(function($)
{
	var sk = window.sk = {
		base: {},
		utils: {},
		widgets: {},
		events: {}
	};

	sk.extend = function(child, parent) {
		var F = function(){};
		F.prototype = parent.prototype;
		child.prototype = new F();
		child._super =  parent.prototype;
		child.prototype.constructor = child;
	};

})(jQuery);


/* **********************************************
     Begin sk.widgets.Carousel.js
********************************************** */

(function(sk, $){

	/*
		Widget Carousel
		version 3

		Created:
		14.02.2012 | Michal Matuška (michal.matuska@superkoderi.cz)

		Updates:
		-

		Fixed bugs:
		-
	*/

	sk.widgets.Carousel = function (element, options)
	{
		this.$element = element.jquery ? element : $(element);
		this.options = $.extend({
			// elementy ktere se budou scrollovat
			item: '>*',
			 // počet elementů k které se bude posouvat
			scroll: 1,
			// aktuální krok
			position: 0,
			// fullscreen režim, bude scrollovat o procenta
			fullscreen: true,
			// skok na začátek
			repeat: false,
			// nekonečné scrollování
			infinite: false,
			// čas za který se provede animace kroku. 0 vypne animaci a bude jen přepínat
			animation: 500,
			// efekt animace
			easing: 'swing',
			// osa
			axis: 'x', // x, y
			// ovládací prvek pro předchozí
			pagerPrev: null,
			// ovládací prvek pro další
			pagerNext: null,
			// vygenerovat menu pro kroky
			pagerPages: null,
			// maska kroků
			pagerMask: null,
			pagerMaskString: '{$active}/{$all}', // {$active} = aktivní položka, {$all} = celkový počet
			// timeout po které se automatiky přepne na další krok. 0 znamená že se automaticky neposunuje
			timeout: 0,
			// callback
			onChange: null,
			// offset
			offset: 0,
			// prázdnej element pro doplnění kroku
			emptyHolder: '<li class="empty"></li>'
		}, options);

		this.axProps = this.options.axis == 'x' ?
			{
				left: 'left',
				width: 'width',
				outerWidth: 'outerWidth',
				scrollWidth: 'scrollWidth',
				scrollLeft: 'scrollLeft',
				offset: 'offsetLeft'
			} :
			{
				left: 'top',
				width: 'height',
				outerWidth: 'outerHeight',
				scrollWidth: 'scrollHeight',
				scrollLeft: 'scrollTop',
				offset: 'offsetTop'
			};

		this.size = this.$element[this.axProps.width]() || 0;
		this.sizeScroll = this.$element.prop(this.axProps.scrollWidth) || 0;
		this.delta = this.sizeScroll - this.size;
		this.position = this.options.position;
		this.scroll = 0;
		this.min = 0;
		this.max = 0;

		return this;
	};

	// SHORTCUT
	//-

	// PROTOTYPE
	var _fn = sk.widgets.Carousel.prototype;


	_fn.init = function()
	{
		if(!this.$element.length )
		{
			return this;
		}

		var o = this.options;

		this.$holder = this.$element[this.axProps.scrollLeft](0).wrap('<div class="sk-carousel sk-carousel-'+o.axis+'"></div>').parent();
		this.$originalItems = this.$items = this.$element.find(o.item);

		this.infinite = o.infinite;
		this.clonedCount = 0;
		if(this.infinite)
		{
			this.clonedCount = this.createInfinite();
			this.$items = this.$element.find(o.item);


		}

		this.length = this.$items.length;

		this.repeat = o.repeat;
		this.scroll = this.getScroll();
		this.steps = this.getSteps();
		this.min = 0;
		this.max = this.steps.length - this.clonedCount * 2 - 1;

		this.animated = o.animation ? true : false;
		this.mainTimer = null;
		// přepnutí událostí
		this.handled = false;

		// pager
		this.pager = new sk.widgets.Pager({
			current: this.position,
			max: this.max,
			infinite: this.repeat || this.infinite,
			pagerPrev: o.pagerPrev,
			pagerNext: o.pagerNext,
			pagerPages: o.pagerPages,
			pagerMask: o.pagerMask,
			pagerMaskString: o.pagerMaskString
		})
		this.pager.init();

		$(this.pager)
			.on('change', $.proxy(function(e, obj)
			{
				this.clearInterval();
				this.handled = true;
				if(obj.prev) var pos = this.infinite ? (this.position - 1) : obj.current;
				if(obj.next) var pos = this.infinite ? (this.position + 1) : obj.current;
				if(obj.page) var pos = obj.current;
				this.setPosition(pos, this.animated);
			}, this));


		if(this.max)
		{
			this.setPosition(this.position, false, true);
			this.isInit = true;

			// callback
			typeof o.onStart == 'function' && o.onStart.call(this, {position: this.position, handled: this.handled});
		}

		return this;
	};

	_fn.destroy = function()
	{
		var o = this.options;

		// odstraní holder
		this.$element.unwrap();
		this.$holder = null;
		delete this.$holder;

		// odstraní itemy
		this.$items = null;
		delete this.$items;
		delete this.length;

		this.pager.destroy();

		// timer
		if(o.timeout)
		{
			this.clearInterval();
			delete this.mainTimer;
		}

		this.isInit = false;
	};

	_fn.setPosition = function(pos, animate, init, animCall)
	{
		var o = this.options;
		this.$element.stop(true, true);

		if(this.infinite)
		{
			var pos = pos;
		}
		else{
			var pos = (pos > this.max) ? this.max :	(pos < this.min) ? this.min : pos;
		}

		if(this.position != pos || init || animCall)
		{


			var params = {};
			params[this.axProps.left] = this.steps[pos + this.clonedCount];

			if(animate)
			{
				this.$element.animate(params, o.animation, o.easing, $.proxy(function(){
					this.setPosition(pos, false, false, true);
				}, this));
				//this.$element.css('-webkit-transform', 'translate3d('+ scroll +',0,0)');
			}
			else
			{
				//this.$element.css('-webkit-transform', 'translate3d('+ scroll +',0,0)');
				this.$element.css(params);
				this.resetInterval();
			}

			if(!animCall)
			{
				// převrátit pozice pokud je opakovaní
				if(this.infinite)
				{
					pos = (pos < this.min) ? this.max : (pos > this.max) ? this.min : pos;
				}
				this.position = pos;

				if(!this.handled)
				{
					this.pager.current = pos;
					this.pager.check();
				}
			}


			if(!init && !animCall)
			{
				// callback
				typeof o.onChange == 'function' && o.onChange.call(this, {position: pos, handled: this.handled});
			}
		}

		this.handled = false;
	};

	_fn.getPosition = function()
	{
		return this.position;
	};

	_fn.getSteps = function()
	{
		var arr = [];
		var o = this.options;

		var prop = this.axProps.left;
		var delta = this.delta;
		var length = this.$items.length;

		for (var i = 0; i < length; i=i+this.scroll)
		{
			if(o.fullscreen)
			{
				var scroll = ( i * -100 ) + '%';
				arr.push(scroll);
			}
			else
			{
				var scroll = -this.$items.eq(i).position()[prop] - ( (i == 0) ? 0 : o.offset);

				if(scroll <= -delta)
				{
					scroll = -delta;
					arr.push(scroll);
					break;
				}

				arr.push(scroll);
			}
		};

		return arr;
	};

	_fn.getScroll = function()
	{
		var o = this.options;

		if(o.fullscreen)
		{
			return 1;
		}

		return o.scroll > this.length - 1  ? this.length : o.scroll;
	};

	// vytvoření nekonečného carouselu
	_fn.createInfinite = function()
	{
		var o = this.options;

		if(o.fullscreen)
		{
			var $cloneFirst = this.$items.first().clone(true).addClass('clone').removeAttr('id').data('sk-carousel-clone', 0);
			var $cloneLast = this.$items.last().clone(true).addClass('clone').removeAttr('id').data('sk-carousel-clone', this.length-1);

			this.$element.append($cloneFirst).prepend($cloneLast);

			return 1;
		}

		// todo infinite carousel
		return 0;
	};

	// timery
	_fn.interval = function()
	{
		this.pager.next();
	};

	_fn.clearInterval = function()
	{
		this.mainTimer = clearTimeout(this.mainTimer);
	};
	_fn.resetInterval = function()
	{
		if(this.options.timeout){
			this.mainTimer = clearTimeout(this.mainTimer);
			this.mainTimer = setTimeout($.proxy(function(){this.interval()}, this), this.options.timeout);
		}
	};

})(sk, jQuery);

/* **********************************************
     Begin sk.widgets.Pager.js
********************************************** */

(function(sk, $){

	/*
		Widget Pager
		version 1

		Created:
		14.02.2012 | Michal Matuška (michal.matuska@superkoderi.cz)

		Updates:
		-

		Fixed bugs:
		-
	*/

	sk.widgets.Pager = function (options)
	{
		this.options = $.extend({
			// aktivní
			current: 0,
			// počet stránek
			max: 0,
			// krok
			step: 1,
			// nekonečné
			infinite: false,
			// ovládací prvek pro předchozí
			pagerPrev: null,
			// ovládací prvek pro další
			pagerNext: null,
			// vygenerovat menu pro kroky
			pagerPages: null,
			// maska kroků
			pagerMask: null,
			pagerMaskString: '{$active}/{$all}', // {$active} = aktivní položka, {$all} = celkový počet


		}, options);

		this.current = this.options.current;
		this.step = this.options.step;
		this.min = 0;
		this.max = this.options.max;
		this.infinite = this.options.infinite;
		this.isInit = false;

		return this;
	};

	// SHORTCUT
	//-

	// PROTOTYPE
	var _fn = sk.widgets.Pager.prototype;


	_fn.init = function()
	{
		/*if(!this.max)
		{
			return this;
		}*/

		var o = this.options;

		// předchozí
		if(o.pagerPrev)
		{
			this.$pagerPrev = o.pagerPrev.jquery ? o.pagerPrev : $(o.pagerPrev);

			this.$pagerPrev
				.bind('mousedown touchstart', $.proxy(this.handlePrev, this))
				.bind('click', $.proxy(this.handlePrevent, this));

			this.prevDisabled = false;
		}

		// další
		if(o.pagerNext)
		{
			this.$pagerNext = o.pagerNext.jquery ? o.pagerNext : $(o.pagerNext);

			this.$pagerNext
				.bind('mousedown touchstart', $.proxy(this.handleNext, this))
				.bind('click', $.proxy(this.handlePrevent, this));

			this.nextDisabled = false;
		}

		// stránky
		if(o.pagerPages)
		{
			this.$pagerPages = o.pagerPages.jquery ? o.pagerPages : $(o.pagerPages);



			var pages = '';
			for(var i = 0; i <= this.max; i++)
			{
				pages += '<a href="#" data-sk-page-index="'+i+'"><span>'+ (i+1) +'</span></a>';
			}

			this.$pagerPages
				.append(pages)
				.on('mousedown touchstart', 'a', $.proxy(this.handlePage, this))
				.on('click', 'a', $.proxy(this.handlePrevent, this));
		}

		// mask
		if(o.pagerMask)
		{
			this.$pagerMask = o.pagerMask.jquery ? o.pagerMask : $(o.pagerMask);
		}

		this.isInit = true;

		this.check();

		return this;
	};

	_fn.reinit = function()
	{
		this.check();
	};

	_fn.destroy = function()
	{
		var o = this.options;

		// odstraní
		if(typeof this.$pagerPrev != 'undefined')
		{
			this.$pagerPrev
				.unbind('mousedown touchstart', this.handlePrev)
				.unbind('click', this.handlePrevent);

			delete this.$pagerPrev;
			delete this.prevDisabled;
		}

		// další
		if(typeof this.$pagerNext != 'undefined')
		{
			this.$pagerNext
				.unbind('mousedown touchstart', this.handleNext)
				.unbind('click', this.handlePrevent);

			delete this.$pagerNext;
			delete this.nextDisabled;
		}

		// stránky
		if(typeof this.$pagerPages != 'undefined')
		{
			this.$pagerPages
				.undelegate('a', 'mousedown touchstart', this.handlePage)
				.undelegate('a', 'click', this.handlePrevent)
				.empty();

			delete this.$pagerPages;
		}

		// mask
		if(typeof this.$pagerMask != 'undefined')
		{
			this.$pagerMask.empty();
			delete this.$pagerMask;
		}

		this.isInit = false;

		return this;
	};

	_fn.prev = function()
	{
		if( this.min != this.current || this.infinite )
		{
			var i = this.current - this.step;

			if(this.infinite)
			{
				this.current = (i + (this.max+1)) % (this.max+1);
			}
			else
			{
				this.current = (i < this.min) ? this.min : (i > this.max) ? this.max : i;
			}

			this.check();

			$(this).trigger('change', [{current: this.current, prev: true, next: false, page: false}]);
		}
	};

	_fn.next = function()
	{
		if( this.max != this.current || this.infinite )
		{
			var i = this.current + this.step;

			if(this.infinite)
			{
				this.current = i % (this.max+1);
			}
			else
			{
				this.current = (i < this.min) ? this.min : (i > this.max) ? this.max : i;
			}

			this.check();

			$(this).trigger('change', [{current: this.current, prev: false, next: true, page: false}]);
		}
	};

	_fn.page = function(i, noCall)
	{
		if( this.current !== i )
		{
			var i = (i < this.min) ? this.min : (i > this.max) ? this.max : i;

			this.current = i;
			this.check();

			if(!noCall)
			{
				$(this).trigger('change', [{current: this.current, prev: false, next: false, page: true}]);
			}
		}
	};



	_fn.check = function()
	{
		this.checkPrev();
		this.checkNext();
		this.checkPage();
		this.checkPagesMask();
	}

	// události
	_fn.handlePrev = function(e)
	{
		if(!this.prevDisabled)
		{
			this.prev();
			e.preventDefault();
		}
	};

	_fn.handleNext = function(e)
	{
		if(!this.nextDisabled)
		{
			this.next();
			e.preventDefault();
		}
	};

	_fn.handlePage = function(e)
	{
		this.page($(e.currentTarget).data('sk-page-index'));
		e.preventDefault();
	};
	_fn.handlePrevent = function(e)
	{
		e.preventDefault();
	};

	// kontroly
	_fn.checkPrev = function(e)
	{
		if(typeof this.$pagerPrev != 'undefined')
		{
			if(!this.max)
			{
				this.$pagerPrev.addClass('off');
				this.prevDisabled = true;
				return;
			}
			else
			{
				this.$pagerPrev.removeClass('off');
			}

			if( this.min >= this.current && !this.infinite )
			{
				this.$pagerPrev.addClass('disabled');
				this.prevDisabled = true;
			}
			else if( this.prevDisabled )
			{
				this.$pagerPrev.removeClass('disabled');
				this.prevDisabled = false;
			}
		}
	};

	_fn.checkNext = function(e)
	{
		if(typeof this.$pagerNext != 'undefined')
		{
			if(!this.max)
			{
				this.$pagerNext.addClass('off');
				this.nextDisabled = true;
				return;
			}
			else
			{
				this.$pagerNext.removeClass('off');
			}

			if(this.max <= this.current && !this.infinite )
			{
				this.$pagerNext.addClass('disabled');
				this.nextDisabled = true;
			}
			else if( this.nextDisabled )
			{
				this.$pagerNext.removeClass('disabled');
				this.nextDisabled = false;
			}
		}
	};

	_fn.checkPage = function()
	{
		if(typeof this.$pagerPages != 'undefined')
		{
			this.$pagerPages
				.find('a')
					.removeClass('active')
					.eq(this.current)
						.addClass('active');
		}
	};

	_fn.checkPagesMask = function()
	{
		if(typeof this.$pagerMask != 'undefined')
		{
			this.$pagerMask
				.text(this.options.pagerMaskString.replace('{$active}', this.current+1).replace('{$all}', this.length));
		}
	};


})(sk, jQuery);