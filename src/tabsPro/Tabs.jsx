import { useEffect, useId, useMemo, useRef } from "react";
import { FiPlus, FiX } from "react-icons/fi";

export default function Tabs({ tabs, activeId, onChange, onCloseRequest, onAddRequest }) {
    const tablistId = useId();
    const buttonRefs = useRef({});
    const tabIds = useMemo(() => tabs.map((tab) => tab.id), [tabs]);
    const activeIndex = Math.max(0, tabIds.indexOf(activeId));

    useEffect(() => {
        for (const key of Object.keys(buttonRefs.current)) {
            if (!tabIds.includes(key)) delete buttonRefs.current[key];
        }
    }, [tabIds]);

    const focusButtonAt = (index) => buttonRefs.current[tabIds[index]]?.focus();
    const handleKeyDown = (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const lastIndex = tabIds.length - 1;
        const nextIndex = event.key === "ArrowRight" ? (activeIndex + 1) % tabIds.length
            : event.key === "ArrowLeft" ? (activeIndex - 1 + tabIds.length) % tabIds.length
                : event.key === "Home" ? 0 : lastIndex;
        onChange(tabIds[nextIndex]);
        focusButtonAt(nextIndex);
    };

    return <div>
        <div className="tablist" role="tablist" aria-label="Primary tabs" id={tablistId} onKeyDown={handleKeyDown}>
            {tabs.map((tabItem) => <button
                key={tabItem.id}
                ref={(node) => { if (node) buttonRefs.current[tabItem.id] = node; }}
                className="tab-button"
                role="tab"
                id={"tab-" + tabItem.id}
                aria-selected={activeId === tabItem.id ? "true" : "false"}
                aria-controls={"panel-" + tabItem.id}
                tabIndex={activeId === tabItem.id ? 0 : -1}
                onClick={() => onChange(tabItem.id)}
                title={tabItem.label}
            >
                <span className="tab-title">{tabItem.label}</span>
                {tabItem.closable && <span
                    role="button"
                    aria-label={"Close " + tabItem.label}
                    className="tab-close"
                    tabIndex={0}
                    onClick={(event) => { event.stopPropagation(); onCloseRequest?.(tabItem.id); }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault(); event.stopPropagation(); onCloseRequest?.(tabItem.id);
                        }
                    }}
                ><FiX aria-hidden="true" /></span>}
            </button>)}
            {onAddRequest && <button className="add-tab" aria-label="Add note tab" title="Add note tab" onClick={onAddRequest}>
                <FiPlus aria-hidden="true" />
            </button>}
        </div>
        {tabs.map((tabItem) => <div
            key={tabItem.id}
            role="tabpanel"
            id={"panel-" + tabItem.id}
            aria-labelledby={"tab-" + tabItem.id}
            hidden={activeId !== tabItem.id}
            className="tab-panel"
        >{typeof tabItem.render === "function" ? tabItem.render() : null}</div>)}
    </div>;
}
