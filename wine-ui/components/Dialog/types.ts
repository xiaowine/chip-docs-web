export interface DialogProps {
  /**
   * 控制对话框是否可见
   */
  modelValue: boolean;
  /**
   * 对话框标题
   */
  title?: string;
  /**
   * 对话框宽度，可以是数字或CSS宽度值
   */
  width?: number | string;
  /**
   * 是否显示关闭按钮
   */
  closable?: boolean;
  /**
   * 点击遮罩层是否关闭对话框
   */
  closeOnClickMask?: boolean;
  /**
   * 内容是否居中
   */
  center?: boolean;
  /**
   * 是否显示底部
   */
  showFooter?: boolean;
  /**
   * 是否显示取消按钮
   */
  showCancel?: boolean;
  /**
   * 确认按钮文本
   */
  confirmText?: string;
  /**
   * 取消按钮文本
   */
  cancelText?: string;
}

export interface DialogEmits {
  (e: "update:modelValue", value: boolean): void;
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "close"): void;
}
