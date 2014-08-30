(function () {
	"use strict";
	function Slider(node) {
		this.node = $(node);
		this.sliderImages = $('.slider-images', this.node);
		this.sliderWidth = this.sliderImages.width();
		this.imgCount = $('.slider-images img', this.node).length;
		this.imageWidth = 910;
		this.imgNumber = 0;
		this.divNumber = 0;
		this.sliderNavigation = $('.slider-navigation', this.node);
		this.navArrow = $('.slider-navigation div div', this.node);
		this.interval = 0;
		this.timeout = 0;
		this.init();
	}
	Slider.prototype.move = function(number) {
		var $nextPosition;
		$('.slider-navigation div .active', this.node).removeClass('active');
		if(number !== undefined) {
			$nextPosition = -this.imgNumber * this.imageWidth;
		} else if(this.imgNumber === this.imgCount - 1) {
			$nextPosition = 0;
			this.imgNumber = 0;
		} else {
			this.imgNumber++;
			$nextPosition = -this.imgNumber * this.imageWidth;
		}
		this.navArrow.eq(this.imgNumber).addClass('active');
		this.sliderImages.stop().animate({
			left: $nextPosition
		}, 500);
	}
	Slider.prototype.setCurrentInterval = function() {
		this.interval = setInterval($.proxy(this.move, this), 2000);
	}
	Slider.prototype.chooseSlide = function() {
		clearInterval(this.interval);
		clearInterval(this.timeout);
		this.imgNumber = this.divNumber;
		this.move(this.imgNumber);
		this.timeout = setTimeout($.proxy(this.setCurrentInterval, this), 5000);
	}
	Slider.prototype.init = function() {
		this.setCurrentInterval();
		var self = this;
		this.navArrow.on('click', function() {
			self.divNumber = self.navArrow.index(this);
			self.chooseSlide();
		});
	}
	window.Slider = Slider;
}());