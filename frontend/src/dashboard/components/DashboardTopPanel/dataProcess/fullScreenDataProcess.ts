import { MetricsType } from "../../../../shared/__types__/enum";
import { cleanMetricsInfo } from "../../../../shared/utils/metricsDataUtils/metricsDataUtils";
import { FourKeyMetrics, Metrics, MetricsUnit } from "../../../../shared/clients/metricsApis";
import { Pipeline } from "../DashboardTopPanel";
import { Option } from "../../../../shared/components/MultipleCascadeSelect";
import { generateTagLabel } from "../../../../shared/utils/dataTransform/dataTransform";

export const mapMetricsList = (metricsResponse: FourKeyMetrics, samplingInterval: MetricsUnit) => {
	const deploymentFrequency = cleanMetricsInfo(metricsResponse.deploymentFrequency);
	const leadTimeForChange = cleanMetricsInfo(metricsResponse.leadTimeForChange);
	const meanTimeToRestore = cleanMetricsInfo(metricsResponse.meanTimeToRestore);
	const changeFailureRate = cleanMetricsInfo(metricsResponse.changeFailureRate);
	return [
		{
			metricsSummaryData: deploymentFrequency.summary.value,
			metricsLevel: deploymentFrequency.summary.level,
			metricsDataLabel: `AVG Times / ${samplingInterval}`,
			metricsText: MetricsType.DEPLOYMENT_FREQUENCY,
			data: deploymentFrequency.details,
		},
		{
			metricsSummaryData: leadTimeForChange.summary.value,
			metricsLevel: leadTimeForChange.summary.level,
			metricsDataLabel: "AVG Days",
			metricsText: MetricsType.LEAD_TIME_FOR_CHANGE,
			data: leadTimeForChange.details,
		},
		{
			metricsSummaryData: meanTimeToRestore.summary.value,
			metricsLevel: meanTimeToRestore.summary.level,
			metricsDataLabel: "AVG Hours",
			metricsText: MetricsType.MEAN_TIME_TO_RESTORE,
			data: meanTimeToRestore.details,
		},
		{
			metricsSummaryData: changeFailureRate.summary.value,
			metricsLevel: changeFailureRate.summary.level,
			metricsDataLabel: "AVG %",
			metricsText: MetricsType.CHANGE_FAILURE_RATE,
			data: changeFailureRate.details,
		},
	];
};

export const mapPipelines = (pipelineOptions: Option[], selectedStageList: Pipeline[]) => {
	return selectedStageList.map(selectedStage => {
		return generateTagLabel(pipelineOptions, selectedStage);
	});
};
export const isNumber = (value: any) => {
	return Number(value) === value;
};

export const addBaseValueToDetailData = (details: Metrics[]) => {
	const detailsDataArray: number[] = details
		.map(({ value }) => value)
		.filter(value => isNumber(value)) as number[];
	if (detailsDataArray.length < 2) return [...details];

	const minValue = Math.min(...detailsDataArray);
	const maxValue = Math.max(...detailsDataArray);
	const baseValue = Math.abs(maxValue - minValue);
	if (baseValue === 0) return [...details];

	return details.map(item => {
		if (isNumber(item.value)) {
			return { ...item, ...{ value: (item.value as number) + baseValue / 2 } };
		} else {
			return { ...item };
		}
	});
};
