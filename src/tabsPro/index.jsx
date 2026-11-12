import { useCallback, useEffect, useMemo, useState } from "react";
import { FiCommand, FiDatabase, FiInfo, FiRefreshCw } from "react-icons/fi";
import { Styled } from "./Styled.js";
import "./styles.css";
import Tabs from "./Tabs.jsx";
import useLocalStorage from "./useLocalStorage.js";

const STORAGE_KEY = "tabspro:data";

export default function TabsProDemo() {
    const initialData = useMemo(() => getInitialData(), []);
    const [persisted, setPersisted, resetPersisted] = useLocalStorage(
        STORAGE_KEY,
        initialData,
        isValidTabsData,
    );
    const [activeId, setActiveId] = useState(persisted.activeId);

    useEffect(() => {
        if (!persisted.tabs.some((tab) => tab.id === activeId)) {
            setActiveId(persisted.tabs[0]?.id || "overview");
        }
    }, [persisted.tabs, activeId]);

    useEffect(() => {
        setPersisted((previous) => previous.activeId === activeId
            ? previous
            : { ...previous, activeId });
    }, [activeId, setPersisted]);

    const getNoteValueById = useCallback((id) => {
        return persisted.tabs.find((tab) => tab.id === id)?.value ?? "";
    }, [persisted.tabs]);

    const updateNoteValueById = useCallback((id, newValue) => {
        setPersisted((previous) => ({
            ...previous,
            tabs: previous.tabs.map((tab) => tab.id === id ? { ...tab, value: newValue } : tab),
        }));
    }, [setPersisted]);

    const tabsWithRender = useMemo(() => persisted.tabs.map((tabData) => {
        if (tabData.type === "note") return { ...tabData, render: () => <div className="tab-content">
            <p className="badge">Personal note - this content is saved locally.</p>
            <textarea className="note-textarea" placeholder="Write anything..." value={getNoteValueById(tabData.id)}
                onChange={(event) => updateNoteValueById(tabData.id, event.target.value)} />
        </div> };
        if (tabData.id === "overview") return { ...tabData, render: () => <div className="tab-content">
            <div className="content-heading"><FiInfo aria-hidden="true" /><strong>Keyboard-friendly by default</strong></div>
            <p>Accessible tabs with ARIA wiring and keyboard support. Add your own note tabs and close them later.</p>
            <ul className="content-list">
                <li>Arrow keys move between tabs and selection updates immediately.</li>
                <li>Home and End jump to the first or last tab.</li>
                <li>Press Delete to close the selected closable tab.</li>
                <li>Close icons appear on closable tabs.</li>
            </ul>
        </div> };
        if (tabData.id === "changelog") return { ...tabData, render: () => <div className="tab-content">
            <div>v1.0 - Initial build with keyboard navigation and persistence.</div>
            <div>v1.1 - Added note tabs, close behavior and a horizontal scrollable strip.</div>
        </div> };
        if (tabData.id === "api") return { ...tabData, render: () => <div className="tab-content">
            <div className="content-heading"><FiDatabase aria-hidden="true" /><strong>Component props</strong></div>
            <code>tabs: Array of tab objects</code><code>activeId: string</code><code>onChange(id): void</code>
            <code>onCloseRequest(id): void</code><code>onAddRequest(): void</code>
        </div> };
        return { ...tabData, render: () => null };
    }), [getNoteValueById, persisted.tabs, updateNoteValueById]);

    const statistics = useMemo(() => ({
        totalTabs: persisted.tabs.length,
        customNotes: persisted.tabs.filter((tab) => tab.type === "note").length,
    }), [persisted.tabs]);

    function addNoteTab() {
        const nextNumber = persisted.tabs.reduce((maxNumber, tab) => {
            const match = tab.type === "note" ? /^Note (\d+)$/.exec(tab.label) : null;
            return Math.max(maxNumber, Number(match?.[1]) || 0);
        }, 0) + 1;
        const uniqueId = globalThis.crypto?.randomUUID?.()
            ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const newTab = {
            id: `note-${uniqueId}`,
            label: `Note ${nextNumber}`,
            type: "note",
            value: "",
            closable: true,
        };
        setPersisted((previous) => ({ ...previous, tabs: [...previous.tabs, newTab] }));
        setActiveId(newTab.id);
    }

    function closeTab(tabId) {
        const tabToClose = persisted.tabs.find((tab) => tab.id === tabId);
        if (!tabToClose?.closable) return;

        const remaining = persisted.tabs.filter((tab) => tab.id !== tabId);
        let nextActive = activeId;
        if (tabId === activeId) {
            const closedIndex = persisted.tabs.findIndex((tab) => tab.id === tabId);
            nextActive = (remaining[Math.max(0, closedIndex - 1)] || remaining[0])?.id;
        }
        setPersisted((previous) => ({ ...previous, tabs: remaining }));
        if (nextActive) setActiveId(nextActive);
    }

    function resetTabs() {
        resetPersisted();
        setActiveId(initialData.activeId);
    }

    return <Styled.Shell>
        <Styled.Panel>
            <div className="eyebrow"><FiCommand aria-hidden="true" /> Reusable interface pattern</div>
            <Styled.Title>Tabs Pro</Styled.Title>
            <Styled.Sub>
                Keyboard-friendly tabs with add, close and localStorage persistence. Use <kbd>Left</kbd>, <kbd>Right</kbd>, <kbd>Home</kbd> or <kbd>End</kbd> to navigate; press <kbd>Delete</kbd> to close a closable tab.
                <span className="badge">{statistics.totalTabs} tabs - {statistics.customNotes} notes</span>
            </Styled.Sub>
            <Tabs tabs={tabsWithRender} activeId={activeId} onChange={setActiveId} onCloseRequest={closeTab} onAddRequest={addNoteTab} />
        </Styled.Panel>
        <div className="reset-row">
            <button type="button" className="reset-button" onClick={resetTabs}>
                <FiRefreshCw aria-hidden="true" /> Reset tabs
            </button>
        </div>
    </Styled.Shell>;
}

function getInitialData() {
    return {
        tabs: [
            { id: "overview", label: "Overview", type: "static", closable: false },
            { id: "changelog", label: "Changelog", type: "static", closable: true },
            { id: "api", label: "API", type: "static", closable: true },
        ],
        activeId: "overview",
    };
}

function isValidTabsData(data) {
    if (!data || !Array.isArray(data.tabs) || data.tabs.length === 0 || typeof data.activeId !== "string") {
        return false;
    }

    const ids = new Set();
    for (const tab of data.tabs) {
        if (!tab || typeof tab.id !== "string" || !tab.id || typeof tab.label !== "string"
            || typeof tab.closable !== "boolean" || !["static", "note"].includes(tab.type)
            || (tab.type === "note" && typeof tab.value !== "string") || ids.has(tab.id)) {
            return false;
        }
        ids.add(tab.id);
    }

    return ids.has(data.activeId);
}
