import React, { useEffect, useId, useMemo, useRef } from "react";

export default function Tabs({
    tabs,
    activeId,
    onChange,
    onCloseRequest,
    onAddRequest,
}) {
    const tablistId = useId();
    const buttonRefs = useRef({});

    const tabIds = useMemo(() => tabs.map((t) => t.id), [tabs]);
    const activeIndex = Math.max(0, tabIds.indexOf(activeId));

    useEffect(() => {
        for (const key of Object.keys(buttonRefs.current)) {
            if (!tabIds.includes(key)) delete buttonRefs.current[key];
        }
    }, [tabIds]);

    const focusButtonAt = (index) => {
        const id = tabIds[index];
        const node = buttonRefs.current[id];
        node?.focus();
    };

    const handleKeyDown = (event) => {
        const key = event.key;
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;

        event.preventDefault();
        const lastIndex = tabIds.length - 1;

        if (key === "ArrowRight") {
            const nextIndex = (activeIndex + 1) % tabIds.length;
            onChange(tabIds[nextIndex]);
            focusButtonAt(nextIndex);
        } else if (key === "ArrowLeft") {
            const nextIndex = (activeIndex - 1 + tabIds.length) % tabIds.length;
            onChange(tabIds[nextIndex]);
            focusButtonAt(nextIndex);
        } else if (key === "Home") {
            onChange(tabIds[0]); focusButtonAt(0);
        } else if (key === "End") {
            onChange(tabIds[lastIndex]); focusButtonAt(lastIndex);
        }
    };

    return (
        <div>
            <div
                className="tablist"
                role="tablist"
                aria-label="Primary tabs"
                id={tablistId}
                onKeyDown={handleKeyDown}
            >
                {tabs.map((tabItem) => (
                    <button
                        key={tabItem.id}
                        ref={(node) => { if (node) buttonRefs.current[tabItem.id] = node; }}
                        className="tab-button"
                        role="tab"
                        id={`tab-${tabItem.id}`}
                        aria-selected={activeId === tabItem.id ? "true" : "false"}
                        aria-controls={`panel-${tabItem.id}`}
                        tabIndex={activeId === tabItem.id ? 0 : -1}
                        onClick={() => onChange(tabItem.id)}
                        title={tabItem.label}
                    >
                        <span className="tab-title">{tabItem.label}</span>
                        {tabItem.closable && (
                            <span
                                role="button"
                                aria-label={`Close ${tabItem.label}`}
                                className="tab-close"
                                onClick={(event) => { event.stopPropagation(); onCloseRequest?.(tabItem.id); }}
                            >
                                ✕
                            </span>
                        )}
                    </button>
                ))}

                {onAddRequest && (
                    <button className="add-tab" aria-label="Add tab" onClick={onAddRequest}>＋</button>
                )}
            </div>

            {tabs.map((tabItem) => (
                <div
                    key={tabItem.id}
                    role="tabpanel"
                    id={`panel-${tabItem.id}`}
                    aria-labelledby={`tab-${tabItem.id}`}
                    hidden={activeId !== tabItem.id}
                    className="tab-panel"
                >
                    {typeof tabItem.render === "function" ? tabItem.render() : null}
                </div>
            ))}

        </div>
    );
}
