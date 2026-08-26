/**
 * Public type surface.
 *
 * Prop types are derived from the components with `ComponentProps`, so they
 * cannot drift from the implementations. Domain shapes live in `domain.ts` and
 * are re-exported here.
 */
import type { ComponentProps } from "svelte";

import type Avatar from "./atoms/Avatar.svelte";
import type BarMeter from "./atoms/BarMeter.svelte";
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
import type Skeleton from "./atoms/Skeleton.svelte";
import type Slider from "./atoms/Slider.svelte";
import type Sparkline from "./atoms/Sparkline.svelte";
import type Switch from "./atoms/Switch.svelte";
import type TableCell from "./atoms/TableCell.svelte";
import type Tag from "./atoms/Tag.svelte";
import type Textarea from "./atoms/Textarea.svelte";
import type Wave from "./atoms/Wave.svelte";
import type Accordion from "./molecules/Accordion.svelte";
import type ActivityItem from "./molecules/ActivityItem.svelte";
import type Alert from "./molecules/Alert.svelte";
import type Breadcrumb from "./molecules/Breadcrumb.svelte";
import type Callout from "./molecules/Callout.svelte";
import type CaseStudyCard from "./molecules/CaseStudyCard.svelte";
import type Combobox from "./molecules/Combobox.svelte";
import type CurrencyInput from "./molecules/CurrencyInput.svelte";
import type DatePicker from "./molecules/DatePicker.svelte";
import type DropdownMenu from "./molecules/DropdownMenu.svelte";
import type EditableTableCell from "./molecules/EditableTableCell.svelte";
import type EmptyState from "./molecules/EmptyState.svelte";
import type FieldRow from "./molecules/FieldRow.svelte";
import type FormField from "./molecules/FormField.svelte";
import type HueControl from "./molecules/HueControl.svelte";
import type ListRow from "./molecules/ListRow.svelte";
import type MetricGrid from "./molecules/MetricGrid.svelte";
import type ModeToggle from "./molecules/ModeToggle.svelte";
import type Pagination from "./molecules/Pagination.svelte";
import type PaletteIndicator from "./molecules/PaletteIndicator.svelte";
import type PullQuote from "./molecules/PullQuote.svelte";
import type SegmentedControl from "./molecules/SegmentedControl.svelte";
import type Slip from "./molecules/Slip.svelte";
import type StackManifest from "./molecules/StackManifest.svelte";
import type Standfirst from "./molecules/Standfirst.svelte";
import type Stat from "./molecules/Stat.svelte";
import type StatusPill from "./molecules/StatusPill.svelte";
import type Tabs from "./molecules/Tabs.svelte";
import type TagInput from "./molecules/TagInput.svelte";
import type Toast from "./molecules/Toast.svelte";
import type Tooltip from "./molecules/Tooltip.svelte";
import type AppHeader from "./organisms/AppHeader.svelte";
import type BenchmarkTable from "./organisms/BenchmarkTable.svelte";
import type CodeBlock from "./organisms/CodeBlock.svelte";
import type CodeBlockGroup from "./organisms/CodeBlockGroup.svelte";
import type CommandPalette from "./organisms/CommandPalette.svelte";
import type ContextualStrip from "./organisms/ContextualStrip.svelte";
import type DataTable from "./organisms/DataTable.svelte";
import type DecisionRecord from "./organisms/DecisionRecord.svelte";
import type DeepDive from "./organisms/DeepDive.svelte";
import type DetailPanel from "./organisms/DetailPanel.svelte";
import type Dialog from "./organisms/Dialog.svelte";
import type Drawer from "./organisms/Drawer.svelte";
import type Figure from "./organisms/Figure.svelte";
import type FormSection from "./organisms/FormSection.svelte";
import type KanbanColumn from "./organisms/KanbanColumn.svelte";
import type LedgerTable from "./organisms/LedgerTable.svelte";
import type Menu from "./organisms/Menu.svelte";
import type Popover from "./organisms/Popover.svelte";
import type ReorderableTable from "./organisms/ReorderableTable.svelte";
import type Section from "./organisms/Section.svelte";
import type Spine from "./organisms/Spine.svelte";
import type SplitPane from "./organisms/SplitPane.svelte";
import type StatusBar from "./organisms/StatusBar.svelte";
import type Stepper from "./organisms/Stepper.svelte";
import type TableOfContents from "./organisms/TableOfContents.svelte";
import type Timeline from "./organisms/Timeline.svelte";
import type ToastRegion from "./organisms/ToastRegion.svelte";
import type TreeView from "./organisms/TreeView.svelte";
import type AppShell from "./templates/AppShell.svelte";
import type CaseStudyIndex from "./templates/CaseStudyIndex.svelte";
import type CaseStudyShell from "./templates/CaseStudyShell.svelte";
import type DashboardTemplate from "./templates/DashboardTemplate.svelte";
import type ListDetailTemplate from "./templates/ListDetailTemplate.svelte";
import type SettingsTemplate from "./templates/SettingsTemplate.svelte";
import type Shell from "./templates/Shell.svelte";

export type { AnchoredOptions, AnchoredPlacement } from "./actions/anchored.js";
export type { FocusTrapOptions } from "./actions/focusTrap.js";
export type { ScrollspyOptions } from "./actions/scrollspy.js";
export type { TocRegistry } from "./caseStudyToc.svelte.js";
/* ---- Shared domain shapes (declared in domain.ts) ---- */
export type * from "./domain.js";
export type { HeadingLevel } from "./headingLevel.js";
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
export type BarMeterProps = ComponentProps<typeof BarMeter>;
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
export type SkeletonProps = ComponentProps<typeof Skeleton>;
export type SliderProps = ComponentProps<typeof Slider>;
export type SparklineProps = ComponentProps<typeof Sparkline>;
export type SwitchProps = ComponentProps<typeof Switch>;
export type TableCellProps = ComponentProps<typeof TableCell>;
export type TagProps = ComponentProps<typeof Tag>;
export type TextareaProps = ComponentProps<typeof Textarea>;
export type WaveProps = ComponentProps<typeof Wave>;

/* molecules */
export type AccordionProps = ComponentProps<typeof Accordion>;
export type ActivityItemProps = ComponentProps<typeof ActivityItem>;
export type AlertProps = ComponentProps<typeof Alert>;
export type BreadcrumbProps = ComponentProps<typeof Breadcrumb>;
export type CalloutProps = ComponentProps<typeof Callout>;
export type CaseStudyCardProps = ComponentProps<typeof CaseStudyCard>;
export type ComboboxProps = ComponentProps<typeof Combobox>;
export type CurrencyInputProps = ComponentProps<typeof CurrencyInput>;
export type DatePickerProps = ComponentProps<typeof DatePicker>;
export type DropdownMenuProps = ComponentProps<typeof DropdownMenu>;
export type EditableTableCellProps = ComponentProps<typeof EditableTableCell>;
export type EmptyStateProps = ComponentProps<typeof EmptyState>;
export type FieldRowProps = ComponentProps<typeof FieldRow>;
export type FormFieldProps = ComponentProps<typeof FormField>;
export type HueControlProps = ComponentProps<typeof HueControl>;
export type ListRowProps = ComponentProps<typeof ListRow>;
export type MetricGridProps = ComponentProps<typeof MetricGrid>;
export type ModeToggleProps = ComponentProps<typeof ModeToggle>;
export type PaginationProps = ComponentProps<typeof Pagination>;
export type PaletteIndicatorProps = ComponentProps<typeof PaletteIndicator>;
export type PullQuoteProps = ComponentProps<typeof PullQuote>;
export type SegmentedControlProps = ComponentProps<typeof SegmentedControl>;
export type SlipProps = ComponentProps<typeof Slip>;
export type StackManifestProps = ComponentProps<typeof StackManifest>;
export type StandfirstProps = ComponentProps<typeof Standfirst>;
export type StatProps = ComponentProps<typeof Stat>;
export type StatusPillProps = ComponentProps<typeof StatusPill>;
export type TabsProps = ComponentProps<typeof Tabs>;
export type TagInputProps = ComponentProps<typeof TagInput>;
export type ToastProps = ComponentProps<typeof Toast>;
export type TooltipProps = ComponentProps<typeof Tooltip>;

/* organisms */
export type AppHeaderProps = ComponentProps<typeof AppHeader>;
export type BenchmarkTableProps = ComponentProps<typeof BenchmarkTable>;
export type CodeBlockGroupProps = ComponentProps<typeof CodeBlockGroup>;
export type CodeBlockProps = ComponentProps<typeof CodeBlock>;
export type CommandPaletteProps = ComponentProps<typeof CommandPalette>;
export type ContextualStripProps = ComponentProps<typeof ContextualStrip>;
export type DataTableProps = ComponentProps<typeof DataTable>;
export type DecisionRecordProps = ComponentProps<typeof DecisionRecord>;
export type DeepDiveProps = ComponentProps<typeof DeepDive>;
export type DetailPanelProps = ComponentProps<typeof DetailPanel>;
export type DialogProps = ComponentProps<typeof Dialog>;
export type DrawerProps = ComponentProps<typeof Drawer>;
export type FigureProps = ComponentProps<typeof Figure>;
export type FormSectionProps = ComponentProps<typeof FormSection>;
export type KanbanColumnProps = ComponentProps<typeof KanbanColumn>;
export type LedgerTableProps = ComponentProps<typeof LedgerTable>;
export type MenuProps = ComponentProps<typeof Menu>;
export type PopoverProps = ComponentProps<typeof Popover>;
export type ReorderableTableProps = ComponentProps<typeof ReorderableTable>;
export type SectionProps = ComponentProps<typeof Section>;
export type SpineProps = ComponentProps<typeof Spine>;
export type SplitPaneProps = ComponentProps<typeof SplitPane>;
export type StatusBarProps = ComponentProps<typeof StatusBar>;
export type StepperProps = ComponentProps<typeof Stepper>;
export type TableOfContentsProps = ComponentProps<typeof TableOfContents>;
export type TimelineProps = ComponentProps<typeof Timeline>;
export type ToastRegionProps = ComponentProps<typeof ToastRegion>;
export type TreeViewProps = ComponentProps<typeof TreeView>;
export type { TreeNodeData } from "./organisms/TreeView.svelte";

/* templates */
export type AppShellProps = ComponentProps<typeof AppShell>;
export type CaseStudyIndexProps = ComponentProps<typeof CaseStudyIndex>;
export type CaseStudyShellProps = ComponentProps<typeof CaseStudyShell>;
export type DashboardTemplateProps = ComponentProps<typeof DashboardTemplate>;
export type ListDetailTemplateProps = ComponentProps<typeof ListDetailTemplate>;
export type SettingsTemplateProps = ComponentProps<typeof SettingsTemplate>;
export type ShellProps = ComponentProps<typeof Shell>;
