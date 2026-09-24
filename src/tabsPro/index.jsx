import { useCallback, useEffect, useMemo, useState } from "react";
import { FiCommand, FiDatabase, FiInfo, FiRefreshCw } from "react-icons/fi";
import { Styled } from "./Styled.js";
import "./styles.css";
import Tabs from "./Tabs.jsx";
import useLocalStorage from "./useLocalStorage.js";

export default function TabsProDemo() {
    const [persisted, setPersisted, resetPersisted] = useLocalStorage("tabspro:data", getInitialData());
    const [activeId, setActiveId] = useState(persisted.activeId);

    useEffect(() => {
        if (!persisted.tabs.some((tab) => tab.id === activeId)) {
            const firstId = persisted.tabs[0]?.id;
            if (firstId) setActiveId(firstId);
        }
    }, [persisted.tabs, activeId]);

    useEffect(() => {
        setPersisted((previous) => ({ ...previous, activeId }));
    }, [activeId, setPersisted]);

    const getNoteValueById = useCallback((id) => {
        return persisted.tabs.find((tab) => tab.id === id)?.value || "";
    }, [persisted.tabs]);

    const updateNoteValueById = useCallback((id, newValue) => {
        setPersisted((previous) => ({
            ...previous,
            tabs: previous.tabs.map((tab) => tab.id === id ? { ...tab, value: newValue } : tab),
        }));
    }, [setPersisted]);

    const tabsWithRender = persisted.tabs.map((tabData) => {
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
                <li>Close icons only appear on closable tabs.</li>
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
    });

    const statistics = useMemo(() => ({
        totalTabs: persisted.tabs.length,
        customNotes: persisted.tabs.filter((tab) => tab.type === "note").length,
    }), [persisted.tabs]);

    function addNoteTab() {
        const nextNumber = persisted.tabs.filter((tab) => tab.type === "note").length + 1;
        const newTab = { id: "note-" + Date.now(), label: "Note " + nextNumber, type: "note", value: "", closable: true };
        setPersisted((previous) => ({ ...previous, tabs: [...previous.tabs, newTab] }));
        setActiveId(newTab.id);
    }
    function closeTab(tabId) {
        const remaining = persisted.tabs.filter((tab) => tab.id !== tabId);
        let nextActive = activeId;
        if (tabId === activeId) {
            const closedIndex = persisted.tabs.findIndex((tab) => tab.id === tabId);
            nextActive = (remaining[Math.max(0, closedIndex - 1)] || remaining[0])?.id;
        }
        setPersisted((previous) => ({ ...previous, tabs: remaining }));
        if (nextActive) setActiveId(nextActive);
    }

    return <Styled.Shell>
        <Styled.Panel>
            <div className="eyebrow"><FiCommand aria-hidden="true" /> Reusable interface pattern</div>
            <Styled.Title>Tabs Pro</Styled.Title>
            <Styled.Sub>
                Keyboard-friendly tabs with add, close and localStorage persistence. Use <kbd>Left</kbd>, <kbd>Right</kbd>, <kbd>Home</kbd> or <kbd>End</kbd> to move through the interface.
                <span className="badge">{statistics.totalTabs} tabs - {statistics.customNotes} notes</span>
            </Styled.Sub>
            <Tabs tabs={tabsWithRender} activeId={activeId} onChange={setActiveId} onCloseRequest={closeTab} onAddRequest={addNoteTab} />
        </Styled.Panel>
        <div className="reset-row">
            <button className="reset-button" onClick={() => { resetPersisted(); location.reload(); }}>
                <FiRefreshCw aria-hidden="true" /> Reset localStorage
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
