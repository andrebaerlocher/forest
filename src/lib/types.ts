/**
 * Public type surface.
 *
 * Prop types are derived from the components with `ComponentProps`, so they
 * cannot drift from the implementations. Domain shapes live in `domain.ts` and
 * are re-exported here.
 */
import type { ComponentProps } from "svelte";

import type Avatar from "./atoms/Avatar.svelte";
import type Button from "./atoms/Button.svelte";
import type Checkbox from "./atoms/Checkbox.svelte";
import type Divider from "./atoms/Divider.svelte";
import type EmbossedContours from "./atoms/EmbossedContours.svelte";
import type Input from "./atoms/Input.svelte";
import type Kbd from "./atoms/Kbd.svelte";
import type Link from "./atoms/Link.svelte";
import type PaperTexture from "./atoms/PaperTexture.svelte";
import type Progress from "./atoms/Progress.svelte";
import type Radio from "./atoms/Radio.svelte";
import type Scrim from "./atoms/Scrim.svelte";
import type SealButton from "./atoms/SealButton.svelte";
import type Select from "./atoms/Select.svelte";
import type Switch from "./atoms/Switch.svelte";
import type TableCell from "./atoms/TableCell.svelte";
import type Tag from "./atoms/Tag.svelte";
import type Textarea from "./atoms/Textarea.svelte";
import type Wave from "./atoms/Wave.svelte";
import type ActivityItem from "./molecules/ActivityItem.svelte";
import type Breadcrumb from "./molecules/Breadcrumb.svelte";
import type Combobox from "./molecules/Combobox.svelte";
import type DatePicker from "./molecules/DatePicker.svelte";
import type DropdownMenu from "./molecules/DropdownMenu.svelte";
import type EditableTableCell from "./molecules/EditableTableCell.svelte";
import type EmptyState from "./molecules/EmptyState.svelte";
import type FieldRow from "./molecules/FieldRow.svelte";
import type FormField from "./molecules/FormField.svelte";
import type HueControl from "./molecules/HueControl.svelte";
import type ListRow from "./molecules/ListRow.svelte";
import type ModeToggle from "./molecules/ModeToggle.svelte";
import type Pagination from "./molecules/Pagination.svelte";
import type PaletteIndicator from "./molecules/PaletteIndicator.svelte";
import type SegmentedControl from "./molecules/SegmentedControl.svelte";
import type Slip from "./molecules/Slip.svelte";
import type Stat from "./molecules/Stat.svelte";
import type StatusPill from "./molecules/StatusPill.svelte";
import type Tabs from "./molecules/Tabs.svelte";
import type Toast from "./molecules/Toast.svelte";
import type Tooltip from "./molecules/Tooltip.svelte";
import type AppHeader from "./organisms/AppHeader.svelte";
import type CommandPalette from "./organisms/CommandPalette.svelte";
import type ContextualStrip from "./organisms/ContextualStrip.svelte";
import type DataTable from "./organisms/DataTable.svelte";
import type DetailPanel from "./organisms/DetailPanel.svelte";
import type Dialog from "./organisms/Dialog.svelte";
import type Drawer from "./organisms/Drawer.svelte";
import type FormSection from "./organisms/FormSection.svelte";
import type KanbanColumn from "./organisms/KanbanColumn.svelte";
import type LedgerTable from "./organisms/LedgerTable.svelte";
import type Spine from "./organisms/Spine.svelte";
import type StatusBar from "./organisms/StatusBar.svelte";
import type Timeline from "./organisms/Timeline.svelte";
import type ToastRegion from "./organisms/ToastRegion.svelte";
import type AppShell from "./templates/AppShell.svelte";
import type DashboardTemplate from "./templates/DashboardTemplate.svelte";
import type ListDetailTemplate from "./templates/ListDetailTemplate.svelte";
import type SettingsTemplate from "./templates/SettingsTemplate.svelte";
import type Shell from "./templates/Shell.svelte";

export type { FocusTrapOptions } from "./actions/focusTrap.js";
/* ---- Shared domain shapes (declared in domain.ts) ---- */
export type * from "./domain.js";
export type {
  Toaster,
  ToasterOptions,
  ToastItem,
  ToastOptions,
  ToastStatus,
} from "./stores/toaster.svelte.js";

/* ---- Component prop types ---- */

/* atoms */
export type AvatarProps = ComponentProps<typeof Avatar>;
export type ButtonProps = ComponentProps<typeof Button>;
export type CheckboxProps = ComponentProps<typeof Checkbox>;
export type DividerProps = ComponentProps<typeof Divider>;
export type EmbossedContoursProps = ComponentProps<typeof EmbossedContours>;
export type InputProps = ComponentProps<typeof Input>;
export type KbdProps = ComponentProps<typeof Kbd>;
export type LinkProps = ComponentProps<typeof Link>;
export type PaperTextureProps = ComponentProps<typeof PaperTexture>;
export type ProgressProps = ComponentProps<typeof Progress>;
export type RadioProps = ComponentProps<typeof Radio>;
export type ScrimProps = ComponentProps<typeof Scrim>;
export type SealButtonProps = ComponentProps<typeof SealButton>;
export type SelectProps = ComponentProps<typeof Select>;
export type SwitchProps = ComponentProps<typeof Switch>;
export type TableCellProps = ComponentProps<typeof TableCell>;
export type TagProps = ComponentProps<typeof Tag>;
export type TextareaProps = ComponentProps<typeof Textarea>;
export type WaveProps = ComponentProps<typeof Wave>;

/* molecules */
export type ActivityItemProps = ComponentProps<typeof ActivityItem>;
export type BreadcrumbProps = ComponentProps<typeof Breadcrumb>;
export type ComboboxProps = ComponentProps<typeof Combobox>;
export type DatePickerProps = ComponentProps<typeof DatePicker>;
export type DropdownMenuProps = ComponentProps<typeof DropdownMenu>;
export type EditableTableCellProps = ComponentProps<typeof EditableTableCell>;
export type EmptyStateProps = ComponentProps<typeof EmptyState>;
export type FieldRowProps = ComponentProps<typeof FieldRow>;
export type FormFieldProps = ComponentProps<typeof FormField>;
export type HueControlProps = ComponentProps<typeof HueControl>;
export type ListRowProps = ComponentProps<typeof ListRow>;
export type ModeToggleProps = ComponentProps<typeof ModeToggle>;
export type PaginationProps = ComponentProps<typeof Pagination>;
export type PaletteIndicatorProps = ComponentProps<typeof PaletteIndicator>;
export type SegmentedControlProps = ComponentProps<typeof SegmentedControl>;
export type SlipProps = ComponentProps<typeof Slip>;
export type StatProps = ComponentProps<typeof Stat>;
export type StatusPillProps = ComponentProps<typeof StatusPill>;
export type TabsProps = ComponentProps<typeof Tabs>;
export type ToastProps = ComponentProps<typeof Toast>;
export type TooltipProps = ComponentProps<typeof Tooltip>;

/* organisms */
export type AppHeaderProps = ComponentProps<typeof AppHeader>;
export type CommandPaletteProps = ComponentProps<typeof CommandPalette>;
export type ContextualStripProps = ComponentProps<typeof ContextualStrip>;
export type DataTableProps = ComponentProps<typeof DataTable>;
export type DetailPanelProps = ComponentProps<typeof DetailPanel>;
export type DialogProps = ComponentProps<typeof Dialog>;
export type DrawerProps = ComponentProps<typeof Drawer>;
export type FormSectionProps = ComponentProps<typeof FormSection>;
export type KanbanColumnProps = ComponentProps<typeof KanbanColumn>;
export type LedgerTableProps = ComponentProps<typeof LedgerTable>;
export type SpineProps = ComponentProps<typeof Spine>;
export type StatusBarProps = ComponentProps<typeof StatusBar>;
export type TimelineProps = ComponentProps<typeof Timeline>;
export type ToastRegionProps = ComponentProps<typeof ToastRegion>;

/* templates */
export type AppShellProps = ComponentProps<typeof AppShell>;
export type DashboardTemplateProps = ComponentProps<typeof DashboardTemplate>;
export type ListDetailTemplateProps = ComponentProps<typeof ListDetailTemplate>;
export type SettingsTemplateProps = ComponentProps<typeof SettingsTemplate>;
export type ShellProps = ComponentProps<typeof Shell>;
