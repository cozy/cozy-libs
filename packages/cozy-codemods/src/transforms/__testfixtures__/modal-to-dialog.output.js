import { Dialog, DialogCloseButton } from "cozy-ui/transpiled/react/CozyDialogs";
import DialogContent from "@material-ui/core/DialogContent";
<Dialog
  onClose={onClose}
  size="l"
  open={true}
  actions={<><Button label="Hello" onClick={doStuff} /></>}
><DialogCloseButton onClose={onClose} />
  <DialogContent></DialogContent>
</Dialog>
