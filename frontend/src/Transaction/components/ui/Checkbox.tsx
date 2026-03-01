import { Checkbox } from 'radix-ui';
import './radix.css';

interface AppCheckboxProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const AppCheckbox = ({ id, checked, onCheckedChange }: AppCheckboxProps) => (
  <Checkbox.Root
    id={id}
    className="checkbox-root"
    checked={checked}
    onCheckedChange={state => onCheckedChange(state === true)}
  >
    <Checkbox.Indicator className="checkbox-indicator">✓</Checkbox.Indicator>
  </Checkbox.Root>
);

export default AppCheckbox;