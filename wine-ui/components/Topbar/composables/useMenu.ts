import type { MenuEventType, MenuItem } from "../types";

export function useMenu(emit: any) {
  const handleOpen = async () => {
    const beforeOpen = await Promise.resolve(emit("before-open") !== false);
    if (!beforeOpen) return;

    emit("update:modelValue", true);
    emit("opened");
  };

  const handleClose = async (type: MenuEventType) => {
    const beforeClose = await Promise.resolve(
      emit("before-close", type) !== false
    );
    if (!beforeClose) return;

    emit("update:modelValue", false);
    emit("closed", type);
  };

  const toggleMenu = async (isOpen: boolean) => {
    if (isOpen) {
      await handleClose("menu");
    } else {
      await handleOpen();
    }
  };

  const handleItemClick = async (item: MenuItem) => {
    const beforeSelect = await Promise.resolve(
      emit("before-select", item) !== false
    );
    if (!beforeSelect) return;

    emit("select", item);
    emit("selected", item);
    item.onClick?.();

    if (window.innerWidth <= 768) {
      await handleClose("menu");
    }
  };

  return {
    handleOpen,
    handleClose,
    toggleMenu,
    handleItemClick,
  };
}
