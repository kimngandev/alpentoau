// frontend/components/CategoryFilterBar.tsx

'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { RiArrowDropDownLine, RiCheckLine, RiSortAsc, RiFilter3Line } from 'react-icons/ri';
import { useTranslation } from 'next-i18next';

// Định nghĩa các trạng thái có thể có của bộ lọc
export interface FilterState {
  sortBy: 'latest' | 'views' | 'rating';
  status: 'all' | 'ongoing' | 'completed';
}

interface CategoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

export default function CategoryFilterBar({ filters, onFilterChange }: CategoryFilterBarProps) {
    const { t } = useTranslation('common');

    // Dữ liệu cho các tùy chọn lọc và sắp xếp
    const sortOptions = [
        { id: 'latest', label: t('filter.latest') },
        { id: 'views', label: t('filter.most_viewed') },
        { id: 'rating', label: t('filter.highest_rated') },
    ];

    const statusOptions = [
        { id: 'all', label: t('filter.all_status') },
        { id: 'ongoing', label: t('filter.ongoing') },
        { id: 'completed', label: t('filter.completed') },
    ];

    const currentSortLabel = sortOptions.find(opt => opt.id === filters.sortBy)?.label;
    const currentStatusLabel = statusOptions.find(opt => opt.id === filters.status)?.label;

    // Component Dropdown tái sử dụng
    const FilterDropdown = ({ label, currentSelectionLabel, options, onSelect, type }: any) => (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                    {type === 'sort' ? <RiSortAsc /> : <RiFilter3Line />}
                    <span>{label}: <strong>{currentSelectionLabel}</strong></span>
                    <RiArrowDropDownLine className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
            </div>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {options.map((option: any) => (
                            <Menu.Item key={option.id}>
                                {({ active }) => (
                                    <button
                                        onClick={() => onSelect(option.id)}
                                        className={`${
                                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                        } ${
                                            filters[type] === option.id ? 'font-bold text-purple-600' : 'text-gray-900 dark:text-gray-200'
                                        } group flex w-full items-center rounded-md px-3 py-2 text-sm`}
                                    >
                                        <span className="flex-grow text-left">{option.label}</span>
                                        {filters[type] === option.id && <RiCheckLine className="h-5 w-5" />}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );

    return (
        <div className="w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700/50 mb-8 flex flex-wrap items-center justify-start gap-4">
            <FilterDropdown
                label={t('filter.sort_by')}
                currentSelectionLabel={currentSortLabel}
                options={sortOptions}
                onSelect={(sortBy: FilterState['sortBy']) => onFilterChange({ sortBy })}
                type="sortBy"
            />
             <FilterDropdown
                label={t('filter.status')}
                currentSelectionLabel={currentStatusLabel}
                options={statusOptions}
                onSelect={(status: FilterState['status']) => onFilterChange({ status })}
                type="status"
            />
        </div>
    );
}
