package org.richfaces.ui.iteration.extendedDataTable;

import javax.faces.view.facelets.ComponentConfig;
import javax.faces.view.facelets.ComponentHandler;
import javax.faces.view.facelets.MetaRuleset;

import org.richfaces.ui.iteration.RowKeyConverterRule;

/**
 * User: Gleb Galkin Date: 11.03.11
 */
public class ExtendedDataTableHandler extends ComponentHandler {
    public ExtendedDataTableHandler(ComponentConfig config) {
        super(config);
    }

    protected MetaRuleset createMetaRuleset(Class type) {
        MetaRuleset metaRuleset = super.createMetaRuleset(type);
        metaRuleset.addRule(RowKeyConverterRule.INSTANCE);
        return metaRuleset;
    }
}
