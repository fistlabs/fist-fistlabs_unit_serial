```fist-fistlabs_unit_serial```
=========

```fist-fistlabs_unit_serial``` is a fist plugin that provides abstract unit ```_fistlabs_unit_serial```.

##Usage

```
$ npm i fist-fistlabs_unit_serial
```

```js
app.install('fist-fistlabs_unit_serial');
app.unit({
    base: '_fistlabs_unit_serial',
    name: 'foo',
    series: ['foo', 'bar'],
    foo: function (track, context) {
        return 1;
    },
    bar: function (track, context) {
        return context.prev + 1;
    }
});
```
