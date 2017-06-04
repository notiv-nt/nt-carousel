;(function (root, factory) {
  // Environment Detection
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // Script tag import i.e., IIFE
    root.NTCarousel = factory();
  }
}(this, function() {
  let __init = Symbol('__init');
  let __fitChildren = Symbol('__fitChildren');
  let __setSlides = Symbol('__setSlides');

  function NTCarousel(_config) {
    this.config = Object.assign({
      el: null,
      slidesCount: 3,
      infinite: true,
      itemsClick: true,
      initialIndex: 0
    }, _config);

    this.sliderContainer = null;
    this.sliderIndex = 0;
    this.MIN_SLIDER_ITEMS = 0;
    this.SLIDER_MIDDLE_INDEX = 0;

    this[__init]();
  };


  /* Private */
  NTCarousel.prototype[__init] = function() {
    let self = this;

    if (typeof self.config.el === 'string') {
      self.sliderContainer = document.querySelector(self.config.el);
    } else {
      self.sliderContainer = self.config.el;
    }

    self.sliderIndex = self.config.initialIndex || 0;

    self.MIN_SLIDER_ITEMS = (self.config.slidesCount * 2) + 1;
    self.SLIDER_MIDDLE_INDEX = Math.ceil(self.config.slidesCount);

    // set data-index attr
    for (let i = 0, len = self.sliderContainer.children.length; i < len; i++) {
      let child = self.sliderContainer.children[i];

      child.setAttribute('data-index', i);
    }

    if (this.config.infinite) {
      self[__fitChildren]();
    }

    self[__setSlides](true);

    if (self.config.itemsClick) {
      self.sliderContainer.addEventListener('click', function(e) {
        let target = e.target;

        if (target.parentNode === self.sliderContainer) {
          let relativeIndex = target.getAttribute('data-slide-index');

          if (relativeIndex) {
            relativeIndex = parseInt(relativeIndex);
          }

          self.sliderIndex += relativeIndex;
          self[__setSlides]();
        }
      });
    }
  };

  NTCarousel.prototype[__fitChildren] = function() {
    let self = this;

    let originalSlides = [];
    let childrenLength = self.sliderContainer.children.length;

    // first, we need all of our original items
    for (let i = 0, len = childrenLength; i < len; i++) {
      let child = self.sliderContainer.children[i];

      originalSlides.push(child);
    }

    // and then we add additional
    for (let i = 0, tempInd = 0; i < self.MIN_SLIDER_ITEMS - childrenLength; i++, tempInd++) {
      if (tempInd > childrenLength - 1) {
        tempInd = 0;
      }

      let child = originalSlides[tempInd].cloneNode(true);

      child.classList.add('is-cloned');
      self.sliderContainer.appendChild(child);
    }
  };

  NTCarousel.prototype[__setSlides] = function(pass) {
    let self = this;

    if (self.sliderIndex < 0) {
      if (!this.config.infinite) {
        return self.sliderIndex = 0;
      }

      else {
        self.sliderIndex = self.sliderContainer.children.length + self.sliderIndex;
      }
    }

    else if (self.sliderIndex >= self.sliderContainer.children.length) {
      if (!this.config.infinite) {
        return self.sliderIndex = self.sliderContainer.children.length - 1;
      }

      else {
        self.sliderIndex = self.sliderIndex - self.sliderContainer.children.length;
      }
    }

    // first, we need to reset classes:
    let classesToRemove = ['is-current'];

    for (let i = 1; i <= self.SLIDER_MIDDLE_INDEX; i++) {
      classesToRemove.push(`is-prev-${i}`);
      classesToRemove.push(`is-next-${i}`);
    }

    for (let i = 0, len = self.sliderContainer.children.length; i < len; i++) {
      let slide = self.sliderContainer.children[i];

      slide.classList.remove.apply(slide.classList, classesToRemove);
      // slide.removeAttribute('data-index');
      slide.removeAttribute('data-slide-index');
    }

    self.sliderContainer.children[self.sliderIndex].classList.add('is-current');

    // prev:
    for (let i = 1, prevIndex = self.sliderIndex - 1; i <= self.SLIDER_MIDDLE_INDEX; i++, prevIndex--) {
      if (prevIndex < 0) {
        if (!this.config.infinite) {
          break;
        }

        prevIndex = self.sliderContainer.children.length - 1;
      }

      let item = self.sliderContainer.children[prevIndex];

      item.classList.add(`is-prev-${i}`);
      item.setAttribute('data-slide-index', i * -1);
    }

    // next:
    for (let i = 1, nextIndex = self.sliderIndex + 1; i <= self.SLIDER_MIDDLE_INDEX; i++, nextIndex++) {
      if (nextIndex >= self.sliderContainer.children.length) {
        if (!this.config.infinite) {
          break;
        }

        nextIndex = 0;
      }

      let item = self.sliderContainer.children[nextIndex];

      item.classList.add(`is-next-${i}`);
      item.setAttribute('data-slide-index', i);
    }

    if (isFunction(self.config.afterSlide) && !pass) {
      self.config.afterSlide(
        self.sliderIndex,
        self.sliderContainer.children[self.sliderIndex]
      );
    }
  };


  /* Public */
  NTCarousel.prototype.next = function() {
    let self = this;

    self.sliderIndex++;
    self[__setSlides]();
  };

  NTCarousel.prototype.prev = function() {
    let self = this;

    self.sliderIndex--;
    self[__setSlides]();
  };


  // helpers:
  function isFunction(functionToCheck) {
    let getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }


  return NTCarousel;
}));
