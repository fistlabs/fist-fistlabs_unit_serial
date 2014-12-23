fist-fistlabs_unit_serial [![Build Status](https://travis-ci.org/fistlabs/fist-fistlabs_unit_serial.svg)](https://travis-ci.org/fistlabs/fist-fistlabs_unit_serial)
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

1. Inherit from ```_fistlabs_unit_serial```
2. Define ```steps``` which elements is unit function members names.
3. Define the methods which represents execution series.

After each step the unit keep previous step returned value in ```context.prev``` property.
Last step result is a unit execution result. If one of steps was rejected, the unit will try to call ```e<stepName>``` method as fallback if exists, but other methods will not be called. To stop steps execution propagation, call ```context.series.clear()```

---------
LICENSE [MIT](LICENSE)
