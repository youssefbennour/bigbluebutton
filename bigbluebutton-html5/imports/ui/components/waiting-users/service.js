import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';

const getGuestPolicy = () => {
  const meeting = Meetings.findOne(
    { meetingId: Auth.meetingID },
    { fields: { 'usersProp.guestPolicy': 1 } },
  );

  return meeting.usersProp.guestPolicy;
};

const isWaitingRoomEnabled = () => getGuestPolicy() === 'ASK_MODERATOR';

const isGuestLobbyMessageEnabled = Meteor.settings.public.app.enableGuestLobbyMessage;

// We use the dynamicGuestPolicy rule for allowing the rememberChoice checkbox
const allowRememberChoice = Meteor.settings.public.app.dynamicGuestPolicy;

const getGuestLobbyMessage = () => {
  const meeting = Meetings.findOne(
    { meetingId: Auth.meetingID },
    { fields: { guestLobbyMessage: 1 } },
  );

  if (meeting) return meeting.guestLobbyMessage;

  return '';
};

const privateMessageVisible = (id) => {
  const privateInputSpace = document.getElementById(id);
  if (privateInputSpace.style.display === 'block') {
    privateInputSpace.style.display = 'none';
  } else {
    privateInputSpace.style.display = 'block';
  }
};

export default {
  privateMessageVisible,
  getGuestPolicy,
  isWaitingRoomEnabled,
  isGuestLobbyMessageEnabled,
  getGuestLobbyMessage,
  allowRememberChoice,
};
