import assert from 'node:assert/strict';
import test from 'node:test';
import { createButton, THEMES } from '../dist/index.js';

for (const theme of Object.keys(THEMES)) {
  test(`${theme}: creation actions share primary colors and interaction states`, () => {
    const Button = createButton(theme);
    for (const disabled of [false, true]) {
      const add = Button.render({ variant: 'add', disabled, children: 'Add item' }, null);
      const primary = Button.render({ variant: 'primary', disabled, children: 'New item' }, null);
      const classes = (element) => element.props.className.split(/\s+/).filter((name) => !name.endsWith('-button-add')).sort();
      assert.deepEqual(classes(add), classes(primary));
      assert.equal(add.props.disabled, disabled);
      assert.equal(add.props.type, 'button');
      assert.match(add.props.className, /hover:/);
      assert.match(add.props.className, /focus-visible:/);
    }
  });
}
