import { toChannel } from '../../src/services/telexService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Telex Service', () => {
  const mockChannelId = 'test-channel-id';
  const mockMessage = {
    message: 'Test message',
    username: 'TestBot',
    event_name: 'Test Event',
    status: 'success'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully send message to channel', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

    await toChannel(mockChannelId, mockMessage);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining(`${process.env.TELEX_BASE_URL}/return/${mockChannelId}`),
      mockMessage
    );
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

    await expect(toChannel(mockChannelId, mockMessage))
      .rejects
      .toThrow('Failed to send message to channel: API Error');
  });

  it('should handle invalid channel ID', async () => {
    await expect(toChannel('', mockMessage))
      .rejects
      .toThrow('Invalid channel ID');
  });
}); 