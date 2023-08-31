import { AiOutlineFileWord, AiOutlineMinusCircle, AiOutlinePlus, AiOutlinePlusCircle, AiOutlineSave } from "react-icons/ai";
import { BiMessageSquareAdd } from "react-icons/bi";
import {
  MdDragIndicator,
  MdFormatAlignCenter,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdLabelImportantOutline,
  MdOutlineEventNote,
} from "react-icons/md";
import { RiDeleteBack2Line } from "react-icons/ri";

const CreateIcon = () => (
  <span className="anticon">
    <AiOutlinePlusCircle  />
  </span>
);

const RemoveNewsIcon = () => (
  <span className="anticon">
    <AiOutlineMinusCircle />
  </span>
);

const OutlineEventIcon = () => (
  <span className="anticon">
    <MdOutlineEventNote />
  </span>
);

const ImportantIcon = () => (
  <span className="anticon">
    <MdLabelImportantOutline />
  </span>
);

const OutlinePlusIcon = () => (
  <span className="anticon">
    <AiOutlinePlus />
  </span>
);

const DragIndicator = () => (
  <span className="anticon">
    <MdDragIndicator />
  </span>
);

const FormatBoldIcon = () => (
  <span className="anticon">
    <MdFormatBold />
  </span>
);

const FormatItalicIcon = () => (
  <span className="anticon">
    <MdFormatItalic />
  </span>
);

const FormatUnderlinedIcon = () => (
  <span className="anticon">
    <MdFormatUnderlined />
  </span>
);

const FormatAlignCenterIcon = () => (
  <span className="anticon">
    <MdFormatAlignCenter />
  </span>
);

const FormatAlignLeftIcon = () => (
  <span className="anticon">
    <MdFormatAlignLeft />
  </span>
);

const FormatAlignRightIcon = () => (
  <span className="anticon">
    <MdFormatAlignRight />
  </span>
);

const OutlineSaveIcon = () => (
  <span className="anticon">
    <AiOutlineSave />
  </span>
);

const OutlineFileWordIcon = () => (
  <span className="anticon">
    <AiOutlineFileWord />
  </span>
);

export {
  OutlineEventIcon,
  ImportantIcon,
  OutlinePlusIcon,
  DragIndicator,
  FormatBoldIcon,
  FormatItalicIcon,
  FormatUnderlinedIcon,
  FormatAlignCenterIcon,
  FormatAlignLeftIcon,
  FormatAlignRightIcon,
  OutlineSaveIcon,
  OutlineFileWordIcon,
  CreateIcon,
  RemoveNewsIcon,
};
