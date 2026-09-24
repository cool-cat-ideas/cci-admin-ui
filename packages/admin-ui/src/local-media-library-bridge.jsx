import React from 'react';

/**
 * Mounts shared React controls inside the framework-owned, imperative media
 * runtime used by encoded Pro modules. The bridge keeps Radix/React details out
 * of the Pro script while preserving the shared visual and accessibility API.
 */
export function createLocalMediaLibraryUiBridge({ createRoot, flushSync = (commit) => commit(), Select, LoadingState, Button, Input, InfoCallout }) {
  if (typeof createRoot !== 'function' || !Select || !LoadingState) {
    throw new Error('The local media library UI bridge requires createRoot, Select and LoadingState.');
  }

  const mount = (container, render) => {
    const root = createRoot(container);
    const update = (props) => flushSync(() => root.render(render(props)));

    return {
      update,
      destroy: () => root.unmount(),
    };
  };

  return {
    mountButton(container, props) {
      if (!Button) throw new Error('The media library requires the shared Button.');
      const controller = mount(container, (nextProps) => <Button {...nextProps} />);
      controller.update(props);
      return controller;
    },
    mountInput(container, props) {
      if (!Input) throw new Error('The media library requires the shared Input.');
      const ref = React.createRef();
      const controller = mount(container, (nextProps) => <Input {...nextProps} ref={ref} />);
      controller.update(props);
      return { ...controller, get node() { return ref.current; } };
    },
    mountFeedback(container, props) {
      if (!InfoCallout) throw new Error('The media library requires the shared InfoCallout.');
      const controller = mount(container, (nextProps) => <InfoCallout {...nextProps} />);
      controller.update(props);
      return controller;
    },
    mountSelect(container, props) {
      const controller = mount(container, (nextProps) => <Select {...nextProps} />);
      controller.update(props);
      return controller;
    },
    mountLoading(container, props) {
      const controller = mount(container, (nextProps) => <LoadingState {...nextProps} />);
      controller.update(props);
      return controller;
    },
  };
}
