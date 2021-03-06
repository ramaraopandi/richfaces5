package org.richfaces.ui.toggle;

/**
 * @author akolonitsky
 * @since Jul 20, 2010
 */
public interface ItemChangeSource {
    /**
     * <p>
     * Add a new {@link org.richfaces.ui.toggle.ItemChangeListener} to the set of listeners interested in being notified when
     * {@link org.richfaces.ui.toggle.ItemChangeEvent}s occur.
     * </p>
     *
     * @param listener The {@link org.richfaces.ui.toggle.ItemChangeListener} to be added
     * @throws NullPointerException if <code>listener</code> is <code>null</code>
     */
    void addItemChangeListener(ItemChangeListener listener);

    /**
     * <p>
     * Return the set of registered {@link org.richfaces.ui.toggle.ItemChangeListener}s for this instance. If there are no
     * registered listeners, a zero-length array is returned.
     * </p>
     */
    ItemChangeListener[] getItemChangeListeners();

    /**
     * <p>
     * Remove an existing {@link org.richfaces.ui.toggle.ItemChangeListener} (if any) from the set of listeners interested in being
     * notified when {@link org.richfaces.ui.toggle.ItemChangeEvent}s occur.
     * </p>
     *
     * @param listener The {@link org.richfaces.ui.toggle.ItemChangeListener} to be removed
     * @throws NullPointerException if <code>listener</code> is <code>null</code>
     */
    void removeItemChangeListener(ItemChangeListener listener);
}
