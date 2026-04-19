import { Card } from ".";
import { ActionButton } from "@/components/ui/ActionButton";
import { useCountdown } from "@/hooks/useCooldown";
import { Settings } from "lucide-react";

export const UpdateSection = ({
  disabled,
  handleUpdate,
  isLoading,
  handleUndo,
}: {
  disabled: boolean;
  isLoading: boolean;
  handleUpdate: () => void;
  handleUndo: () => void;
}) => {
  const updateCooldown = useCountdown(5);
  const undoCooldown = useCountdown(5);

  const handleUpdateClick = () => {
    if (!updateCooldown.active) return updateCooldown.start();
    updateCooldown.reset();
    if (!disabled) handleUpdate();
  };

  const handleUndoClick = () => {
    if (!undoCooldown.active) return undoCooldown.start();
    undoCooldown.reset();
    if (!disabled) handleUndo();
  };

  return (
    <Card
      icon={Settings}
      title="Atualização"
      className="col-span-1 lg:col-span-2 xl:col-span-3"
    >
      <div className="col-span-1 pt-2 gap-2 grid grid-cols-2">
        <ActionButton
          className="w-full uppercase"
          disabled={disabled}
          onClick={handleUpdateClick}
          intent={updateCooldown.active ? "success" : "default"}
        >
          {isLoading
            ? "Processando..."
            : updateCooldown.active
              ? `Confirmar atualização em (${updateCooldown.time}s)`
              : "Salvar alterações"}
        </ActionButton>
        <ActionButton
          className="w-full uppercase"
          disabled={disabled}
          onClick={handleUndoClick}
          intent={undoCooldown.active ? "danger" : "default"}
        >
          {isLoading
            ? "Processando..."
            : undoCooldown.active
              ? `Confirmar em (${undoCooldown.time}s)`
              : "Descartar alterações"}
        </ActionButton>
      </div>
    </Card>
  );
};
