import { memo } from "react";

const ChevronRightIcon = memo(
  /**
   * 
   * @param {{ fill?: string }} props 
   * @returns 
   */
  (props) => <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M9.4 18 8 16.6l4.6-4.6L8 7.4 9.4 6l6 6Z" fill={props.fill} /></svg>);
export default ChevronRightIcon;