import { group, multiplexer, source } from './src';

const mlt = multiplexer({
  int: source<number>(),
  mlt: multiplexer({
    a: source<'a'>(),
    b: source<'b'>(),
  }),
  grp: group({
    c: source<'c'>(),
    d: source<'d'>()
  })
});

mlt.emit('int', 5);
mlt.emit('mlt', 'c');
mlt.emit('mlt.a', 'a');
mlt.emit('mlt.b', 'b');
mlt.emit('grp', 'c');
mlt.emit('grp', 'd');
mlt.emit('grp.c', 'c');
mlt.emit('grp.d', 'd');

mlt.on('int', (d) => null);
mlt.on('mlt', (d) => null);
mlt.on('mlt.a', (d) => null);
mlt.on('mlt.b', (d) => null);
mlt.on('grp', (d) => null);
mlt.on('grp', (d) => null);
mlt.on('grp.c', (d) => null);
mlt.on('grp.d', (d) => null);
