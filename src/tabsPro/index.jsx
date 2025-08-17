import React, { useMemo, useState } from "react";
import { Styled } from "./Styled.js";
import "./styles.css";
import Tabs from "./Tabs.jsx";
import useLocalStorage from "./useLocalStorage.js";

export default function TabsProDemo() {
    const [persisted, setPersisted, resetPersisted] = useLocalStorage("tabspro:data", getInitialData());
    const [activeId, setActiveId] = useState(persisted.activeId);

    React.useEffect(() => {
        const stillExists = persisted.tabs.some((t) => t.id === activeId);
        if (!stillExists) {
            const firstId = persisted.tabs[0]?.id;
            if (firstId) setActiveId(firstId);
        }
    }, [persisted.tabs, activeId]);

    React.useEffect(() => {
        setPersisted((prev) => ({ ...prev, activeId }));
    }, [activeId, setPersisted]);

    function getNoteValueById(id) {
        const target = persisted.tabs.find((t) => t.id === id);
        return target?.value || "";
    }
    function updateNoteValueById(id, newValue) {
        setPersisted((prev) => ({
            ...prev,
            tabs: prev.tabs.map((t) => (t.id === id ? { ...t, value: newValue } : t)),
        }));
    }

    const tabsWithRender = useMemo(() => {
        return persisted.tabs.map((tabData) => {
            if (tabData.type === "note") {
                return {
                    ...tabData,
                    render: () => (
                        <div style={{ display: "grid", gap: 10 }}>
                            <p className="badge">Personal note — this content is saved locally.</p>
                            <textarea
                                className="note-textarea"
                                placeholder="Write anything..."
                                value={getNoteValueById(tabData.id)}
                                onChange={(event) => updateNoteValueById(tabData.id, event.target.value)}
                            />
                        </div>
                    ),
                };
            }

            if (tabData.id === "overview") {
                return {
                    ...tabData,
                    render: () => (
                        <div style={{ display: "grid", gap: 8 }}>
                            <p>Accessible tabs with ARIA wiring and keyboard support. Add your own note tabs and close them later.</p>
                            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
                                <li>Arrow keys move between tabs; selection updates immediately.</li>
                                <li>Home/End jump to first/last tab.</li>
                                <li>Close icons only appear on closable tabs.</li>
                            </ul>
                        </div>
                    ),
                };
            }
            if (tabData.id === "changelog") {
                return {
                    ...tabData,
                    render: () => (
                        <div style={{ display: "grid", gap: 6 }}>
                            <div>v1.0 – Initial build with keyboard navigation and persistence.</div>
                            <div>v1.1 – Added note tabs, close behavior, and horizontal scrollable strip.</div>
                        </div>
                    ),
                };
            }
            if (tabData.id === "api") {
                return {
                    ...tabData,
                    render: () => (
                        <div style={{ display: "grid", gap: 10 }}>
                            <p><strong>Props</strong></p>
                            <code>tabs: Array&lt;{`{ id, label, closable?, render() }`}&gt;</code>
                            <code>activeId: string</code>
                            <code>onChange(id): void</code>
                            <code>onCloseRequest(id): void</code>
                            <code>onAddRequest(): void</code>
                        </div>
                    ),
                };
            }

            return { ...tabData, render: () => null };
        });
    }, [persisted.tabs]);

    const statistics = useMemo(() => ({
        totalTabs: persisted.tabs.length,
        customNotes: persisted.tabs.filter((t) => t.type === "note").length,
    }), [persisted.tabs]);

    function addNoteTab() {
        const nextNumber = (persisted.tabs.filter((t) => t.type === "note").length || 0) + 1;
        const newId = `note-${Date.now()}`;
        const newTab = {
            id: newId,
            label: `Note ${nextNumber}`,
            type: "note",
            value: "",
            closable: true,
        };
        setPersisted({ ...persisted, tabs: [...persisted.tabs, newTab] });
        setActiveId(newId);
    }

    function closeTab(tabId) {
        const remaining = persisted.tabs.filter((t) => t.id !== tabId);
        let nextActive = activeId;
        if (tabId === activeId) {
            const closedIndex = persisted.tabs.findIndex((t) => t.id === tabId);
            const neighbor = remaining[Math.max(0, closedIndex - 1)] || remaining[0];
            nextActive = neighbor?.id;
        }
        setPersisted({ ...persisted, tabs: remaining });
        if (nextActive) setActiveId(nextActive);
    }

    return (
        <Styled.Shell>
            <Styled.Panel>
                <Styled.Title>Tabs Pro</Styled.Title>
                <Styled.Sub>
                    Keyboard-friendly tabs with add/close and localStorage persistence. Use <kbd>←</kbd>/<kbd>→</kbd>, <kbd>Home</kbd>, <kbd>End</kbd>.
                    &nbsp;<span className="badge">{statistics.totalTabs} tabs • {statistics.customNotes} notes</span>
                </Styled.Sub>

                <Tabs
                    tabs={tabsWithRender}
                    activeId={activeId}
                    onChange={setActiveId}
                    onCloseRequest={closeTab}
                    onAddRequest={addNoteTab}
                />
            </Styled.Panel>

            <Styled.Row style={{ marginTop: 12, justifyContent: "flex-end" }}>
                <button onClick={() => { resetPersisted(); location.reload(); }}>
                    Reset localStorage
                </button>
            </Styled.Row>
        </Styled.Shell>
    );
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
