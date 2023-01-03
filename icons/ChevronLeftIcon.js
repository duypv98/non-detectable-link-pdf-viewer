import { memo } from "react";

const ChevronLeftIcon = memo(
  /**
   * 
   * @param {{ fill?: string }} props 
   * @returns 
   */
  (props) => <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m14 18-6-6 6-6 1.4 1.4-4.6 4.6 4.6 4.6Z" fill={props.fill} /></svg>);
export default ChevronLeftIcon;