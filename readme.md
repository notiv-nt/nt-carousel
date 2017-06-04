# Just a nice carousel

### Demo:
- https://notiv-nt.github.io/nt-carousel/demo/plain/
- https://notiv-nt.github.io/nt-carousel/demo/perspective/
- https://notiv-nt.github.io/nt-carousel/demo/one-page/


### Use:

```
wrapper#our-slider
  slider element
  slider element
  slider element
  slider element
```

Example:
```html
<div id="our-slider">
  <div>Slide</div>
  <div>Slide</div>
  <div>Slide</div>
</div>
```

```javascript
new NTCarousel({
  // string or HTMLElement
  // Default: null
  // Required
  el: '#our-slider',

  // The number of slides on each side, excluding the `.is-current`
  // Default: 3
  slidesCount: 3,

  // Default: true
  infinite: true,

  // Allow slide by clicking
  // Default: true
  itemsClick: true,

  // Set the initial index of the `.is-current` slide
  initialIndex: 0
});
```
