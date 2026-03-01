import { Select } from 'radix-ui';
import './radix.css';

export interface SelectOption {
  value: string;
  label: string;
}

interface AppSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  triggerClass?: string;
}

const AppSelect = ({
  value,
  onValueChange,
  options,
  placeholder = 'Sélectionner...',
  triggerClass = 'select-trigger',
}: AppSelectProps) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger className={triggerClass}>
      <Select.Value placeholder={placeholder} />
      <Select.Icon className="select-icon">▾</Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content className="select-content" position="popper" sideOffset={4} collisionPadding={8}>
        <Select.Viewport className="select-viewport">
          {options.map(opt => (
            <Select.Item key={opt.value} value={opt.value} className="select-item">
              <Select.ItemText>{opt.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export default AppSelect;