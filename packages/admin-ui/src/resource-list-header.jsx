import React from 'react';
import { Plus } from 'lucide-react';
import { createCardComponents } from './card.jsx';
import { createButton } from './button.jsx';
const { CardHeader } = createCardComponents();
const Button = createButton();

/** One hierarchy and one primary create action across product resource lists. */
export function ResourceListHeader({ title, description, createLabel, createHref, onCreate, disabled = false }) {
    const content = <><Plus aria-hidden="true" /><span>{createLabel}</span></>;
    return (
        <CardHeader className="cci-admin-resource-list-header tw-flex-wrap">
            <div className="tw-min-w-0 tw-flex-1">
                <h2 className="!tw-m-0 !tw-text-lg !tw-font-semibold !tw-leading-6">{title}</h2>
                {description && <p className="!tw-m-0 !tw-text-sm !tw-font-normal !tw-leading-5">{description}</p>}
            </div>
            {createHref && !disabled ? (
                <Button variant="primary" size="default" className="tw-shrink-0" asChild><a href={createHref}>{content}</a></Button>
            ) : (
                <Button variant="primary" size="default" className="tw-shrink-0" onClick={onCreate} disabled={disabled}>{content}</Button>
            )}
        </CardHeader>
    );
}
