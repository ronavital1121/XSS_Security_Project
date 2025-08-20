import { useNotesState } from '../contexts/NotesContext';

const Notification = () => {
  const { notification } = useNotesState();

  if (!notification || notification === 'Notification area') return null;

  return (
    <div className="notification" role="alert" data-testid="notification">
      {notification}
    </div>
  );
};

export default Notification;
