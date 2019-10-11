# HoCs

cozy-hocs is a lib that gather and expose a few HoCs

## Demo

```jsx
import { withOffline } from "cozy-hocs";

const MyComponent = props => {
  if (props.isOffline) {
    return "Offline";
  }
  return "Online";
};

export default withOffline(MyComponent);
```
