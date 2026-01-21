import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import type { Mock } from "vitest";

vi.mock("@neynar/react", () => ({
  useMiniApp: vi.fn(),
}));

vi.mock("~/lib/WalletContext", () => ({
  useWallet: vi.fn(),
}));

vi.mock("~/lib/wordleStreakContract", () => ({
  getWordleStreakContract: vi.fn(),
}));

vi.mock("~/lib/dailyWord", async () => {
  const actual = await vi.importActual<typeof import("~/lib/dailyWord")>("~/lib/dailyWord");
  return {
    ...actual,
    getDailyWord: vi.fn(),
  };
});

const mockDailyWord = "CRANE";

type WordleGameComponent = typeof import("~/components/WordleGame").default;

const mockUseMiniApp = () => vi.mocked(require("@neynar/react").useMiniApp as Mock);
const mockUseWallet = () => vi.mocked(require("~/lib/WalletContext").useWallet as Mock);
const mockGetDailyWord = () => vi.mocked(require("~/lib/dailyWord").getDailyWord as Mock);
const mockGetContract = () => vi.mocked(require("~/lib/wordleStreakContract").getWordleStreakContract as Mock);

const createMockWallet = (chainId: number) => ({
  getNetwork: vi.fn().mockResolvedValue({ chainId }),
  getSigner: vi.fn(),
});

const loadComponent = async (): Promise<WordleGameComponent> => {
  mockGetDailyWord().mockReturnValue(mockDailyWord);

  const module = await import("~/components/WordleGame");
  return module.default;
};

describe("WordleGame", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it("prompts the user to switch networks when not on Base", async () => {
    const wallet = createMockWallet(1);
    mockUseWallet().mockReturnValue({
      wallet,
      account: "0x123",
      isConnecting: false,
      connectWallet: vi.fn(),
      error: null,
    });

    mockUseMiniApp().mockReturnValue({
      context: { user: { fid: 1 }, client: {} },
      setInitialTab: vi.fn(),
      setActiveTab: vi.fn(),
      currentTab: "home",
      isSDKLoaded: true,
    });

    mockGetContract().mockReturnValue({
      getStreak: vi.fn().mockResolvedValue([0, 0, 0]),
      guessesLeft: vi.fn().mockResolvedValue(3),
      hasWonToday: vi.fn().mockResolvedValue(false),
      guessToday: vi.fn().mockResolvedValue({ wait: vi.fn() }),
    });

    const WordleGame = await loadComponent();
    render(<WordleGame />);

    await waitFor(() => {
      expect(
        screen.getByText(/You are connected to the wrong network/i)
      ).toBeInTheDocument();
    });

    const switchButton = screen.getByRole("button", { name: /Switch to Base/i });
    expect(switchButton).toBeEnabled();
  });

  it("allows guess submission once on Base", async () => {
    const wallet = createMockWallet(8453);
    const guessTodayMock = vi.fn().mockResolvedValue({ wait: vi.fn() });

    mockUseWallet().mockReturnValue({
      wallet,
      account: "0x123",
      isConnecting: false,
      connectWallet: vi.fn(),
      error: null,
    });

    mockUseMiniApp().mockReturnValue({
      context: { user: { fid: 1 }, client: {} },
      setInitialTab: vi.fn(),
      setActiveTab: vi.fn(),
      currentTab: "home",
      isSDKLoaded: true,
    });

    mockGetContract().mockReturnValue({
      getStreak: vi.fn().mockResolvedValue([0, 0, 0]),
      guessesLeft: vi.fn().mockResolvedValue(3),
      hasWonToday: vi.fn().mockResolvedValue(false),
      guessToday: guessTodayMock,
    });

    const WordleGame = await loadComponent();
    render(<WordleGame />);

    const input = await screen.findByPlaceholderText(/guess/i);
    fireEvent.change(input, { target: { value: mockDailyWord } });

    const guessButton = screen.getByRole("button", { name: /guess/i });
    expect(guessButton).toBeEnabled();

    fireEvent.click(guessButton);

    await waitFor(() => {
      expect(screen.getByText(/you won/i)).toBeInTheDocument();
    });

    expect(guessTodayMock).toHaveBeenCalledWith(true);
  });
});
